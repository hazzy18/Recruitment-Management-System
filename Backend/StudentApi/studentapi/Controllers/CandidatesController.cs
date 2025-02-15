
//---------------------------------------------------------------------------


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using studentapi.Data;
using OfficeOpenXml;
using System;
using System.IO;
using Microsoft.AspNetCore.Authorization;



[ApiController]
[Route("api/candidates")]
public class CandidatesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;


    public CandidatesController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;

    }

    

[Authorize(Roles = "Recruiter,Admin")]
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












//     [HttpPost]
//     [RequestSizeLimit(10 * 1024 * 1024)] // Limit file size to 10MB

//     public async Task<IActionResult> AddCandidate([FromBody] CandidateDto candidateDto, [FromForm] IFormFile? file)
//     {
//         // Create new Candidate
//         var candidate = new Candidate
//         {
//             Name = candidateDto.Name,
//             Email = candidateDto.Email,
//             Phone = candidateDto.Phone,
//             Experience = candidateDto.Experience
//         };

//         _context.Candidates.Add(candidate);
//         await _context.SaveChangesAsync();

//         // Retrieve the Candidate ID
//         int candidateId = candidate.Id;

//     // Step 2: Handle file upload
//     if (file != null && file.Length > 0)
//     {
//         string uploadFolder = Path.Combine(_environment.WebRootPath, "CVs");
//         if (!Directory.Exists(uploadFolder))
//         {
//             Directory.CreateDirectory(uploadFolder);
//         }

//         string uniqueFileName = $"{candidateId}_{DateTime.UtcNow.Ticks}{Path.GetExtension(file.FileName)}";
//         string filePath = Path.Combine(uploadFolder, uniqueFileName);

//         using (var fileStream = new FileStream(filePath, FileMode.Create))
//         {
//             await file.CopyToAsync(fileStream);
//         }

//         // Step 3: Save file path in the Candidate table
//         candidate.CV_FilePath = $"/uploads/{uniqueFileName}";
//         await _context.SaveChangesAsync();
//     }

//         // Insert Candidate Skills
//         if (candidateDto.SkillIds != null && candidateDto.SkillIds.Any())
//         {
//             var candidateSkills = candidateDto.SkillIds.Select(skillId => new CandidateSkill
//             {
//                 CandidateId = candidateId,
//                 SkillId = skillId
//             });

//             _context.CandidateSkills.AddRange(candidateSkills);
//             await _context.SaveChangesAsync();
//         }

//         // Find matching jobs
//         var matchingJobs = (from jp in _context.JobPositions
//                         join js in _context.JobSkills on jp.Id equals js.JobId
//                             join cs in _context.CandidateSkills on js.SkillId equals cs.SkillId
//                             where cs.CandidateId == candidateId
//                             select new { jp.Id, jp.Status })
//                             .Distinct()
//                             .ToList();
//         Console.WriteLine("Matching Jobs: " + string.Join(", ", matchingJobs.Select(j => j.Id))); // Debugging

// // Filter jobs where status is "Open"
//     var openJobs = matchingJobs.Where(j => j.Status.ToLower() == "open").ToList();

// if(openJobs.Any())
// {
//         // Insert into Resume Screening Table
//         var resumeScreenings = openJobs.Select(job => new ResumeScreening
//         {
//             JobId = job.Id,
//             CandidateId = candidateId,
//             ReviewerId = null,
//             Status = "Pending",
//             ScreenedAt = DateTime.Now
//         });

//         _context.ResumeScreenings.AddRange(resumeScreenings);
//         await _context.SaveChangesAsync();
//     }

//         return Ok(new { message = "Candidate added and matched with jobs.", candidateId ,cvFilePath = candidate.CV_FilePath});
//     }







[Authorize(Roles = "Candidate,Admin")]

[HttpPost("upload/{resumeScreeningId}")]
    public async Task<IActionResult> UploadDocument(int resumeScreeningId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // Step 1: Find the ResumeScreening entry
        var screening = await _context.ResumeScreenings
            .Where(rs => rs.Id == resumeScreeningId)
            .Include(rs => rs.Candidate) // Include candidate details
            .FirstOrDefaultAsync();

        if (screening == null || screening.Candidate == null)
        {
            return NotFound("Resume screening record or candidate not found.");
        }

        int candidateId = screening.CandidateId;

        // Step 2: Define upload path inside wwwroot/uploads
        string uploadFolder = Path.Combine(_environment.WebRootPath, "uploads");
        if (!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }

        // Step 3: Generate unique file name and save
        string uniqueFileName = $"{candidateId}_{DateTime.UtcNow.Ticks}{Path.GetExtension(file.FileName)}";
        string filePath = Path.Combine(uploadFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // Step 4: Save file path in the candidate's document field
        screening.Candidate.Document = $"/uploads/{uniqueFileName}"; // Store relative path
        screening.Status = "Document Uploaded";

        await _context.SaveChangesAsync();

        return Ok(new { message = "File uploaded successfully!", filePath = screening.Candidate.Document });
    }














[Authorize(Roles = "Recruiter,Admin")]
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
