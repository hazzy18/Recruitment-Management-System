using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using studentapi.Data;
using OfficeOpenXml;
using System;


[ApiController]
[Route("api/candidates")]
public class CandidatesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CandidatesController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpPost("upload")]
    public async Task<IActionResult> UploadCandidates(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream);
            using (var package = new ExcelPackage(stream))
            {
                var worksheet = package.Workbook.Worksheets[0]; // Assuming first sheet
                int rowCount = worksheet.Dimension.Rows;

                var candidates = new List<Candidate>();

                for (int row = 2; row <= rowCount; row++) // Assuming first row is header
                {
                    var name = worksheet.Cells[row, 1].Value?.ToString();
                    var email = worksheet.Cells[row, 2].Value?.ToString();
                    var phone = worksheet.Cells[row, 3].Value?.ToString();
                    var experience = Convert.ToInt32(worksheet.Cells[row, 4].Value ?? "0");
                    var skillIds = worksheet.Cells[row, 5].Value?.ToString()?.Split(',')
                        .Select(s => int.TryParse(s, out var id) ? id : (int?)null)
                        .Where(id => id.HasValue)
                        .Select(id => id.Value)
                        .ToList();

                    if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(email))
                    {
                        // Create a new candidate
                        var candidate = new Candidate
                        {
                            Name = name,
                            Email = email,
                            Phone = phone,
                            Experience = experience
                        };

                        _context.Candidates.Add(candidate);
                        await _context.SaveChangesAsync(); // Save to get Candidate ID

                        // Now, save the skills for this candidate
                        if (skillIds != null && skillIds.Any())
                        {
                            var candidateSkills = skillIds.Distinct().Select(skillId => new CandidateSkill
                            {
                                CandidateId = candidate.Id, // Assign the correct CandidateId
                                SkillId = skillId
                            }).ToList();

                            _context.CandidateSkills.AddRange(candidateSkills);
                            await _context.SaveChangesAsync(); // Save CandidateSkills
                        }

                        //  Job Matching Logic: Find jobs that match candidate skills
                        var matchingJobs = (from jp in _context.JobPositions
                             join js in _context.JobSkills on jp.Id equals js.JobId
                            where skillIds.Contains(js.SkillId)
                            select new { jp.Id, jp.Status }) // Select only required fields

                            .Distinct()
                            .ToList();

 // Filter only "Open" jobs
                    var openJobs = matchingJobs.Where(j => j.Status.ToLower() == "open").ToList();


                        if (openJobs.Any())
                        {
                            // Insert into Resume Screening Table
                            var resumeScreenings = openJobs.Select(job => new ResumeScreening
                            {
                                JobId = job.Id,
                                CandidateId = candidate.Id,
                                ReviewerId = null, // Assign later
                                Status = "Pending",
                                ScreenedAt = DateTime.Now
                            }).ToList();

                            _context.ResumeScreenings.AddRange(resumeScreenings);
                            await _context.SaveChangesAsync();


                        }
                    }


                }
            }
        }
        return Ok(new { message = "Candidates and skills uploaded successfully." });
    }

    [HttpPost]
    public async Task<IActionResult> AddCandidate([FromBody] CandidateDto candidateDto)
    {
        // Create new Candidate
        var candidate = new Candidate
        {
            Name = candidateDto.Name,
            Email = candidateDto.Email,
            Phone = candidateDto.Phone,
            Experience = candidateDto.Experience
        };

        _context.Candidates.Add(candidate);
        await _context.SaveChangesAsync();

        // Retrieve the Candidate ID
        int candidateId = candidate.Id;

        // Insert Candidate Skills
        if (candidateDto.SkillIds != null && candidateDto.SkillIds.Any())
        {
            var candidateSkills = candidateDto.SkillIds.Select(skillId => new CandidateSkill
            {
                CandidateId = candidateId,
                SkillId = skillId
            });

            _context.CandidateSkills.AddRange(candidateSkills);
            await _context.SaveChangesAsync();
        }

        // Find matching jobs
        var matchingJobs = (from jp in _context.JobPositions
                        join js in _context.JobSkills on jp.Id equals js.JobId
                            join cs in _context.CandidateSkills on js.SkillId equals cs.SkillId
                            where cs.CandidateId == candidateId
                            select new { jp.Id, jp.Status })
                            .Distinct()
                            .ToList();
        Console.WriteLine("Matching Jobs: " + string.Join(", ", matchingJobs.Select(j => j.Id))); // Debugging

// Filter jobs where status is "Open"
    var openJobs = matchingJobs.Where(j => j.Status.ToLower() == "open").ToList();

if(openJobs.Any())
{
        // Insert into Resume Screening Table
        var resumeScreenings = openJobs.Select(job => new ResumeScreening
        {
            JobId = job.Id,
            CandidateId = candidateId,
            ReviewerId = null,
            Status = "Pending",
            ScreenedAt = DateTime.Now
        });

        _context.ResumeScreenings.AddRange(resumeScreenings);
        await _context.SaveChangesAsync();
    }

        return Ok(new { message = "Candidate added and matched with jobs.", candidateId });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CandidateGetDto>>> GetCandidates()
    {
        var candidates = await _context.Candidates.ToListAsync();

        // Map Candidates to CandidateGetDto (for GET requests)
        var candidateDTOs = candidates.Select(c => new CandidateGetDto
        {
            Name = c.Name,
            Email = c.Email,
            Phone = c.Phone,
            Experience = c.Experience
        }).ToList();

        return Ok(candidateDTOs);
    }




}
public class CandidateGetDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int Experience { get; set; }
}
