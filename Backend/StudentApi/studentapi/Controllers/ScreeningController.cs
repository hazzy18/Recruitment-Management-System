using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using studentapi.Data;
using System;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("api/screenings")]
public class ScreeningController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ScreeningController(ApplicationDbContext context)
    {
        _context = context;
    }   


// [Authorize(Roles = "Candidate,Interviewer")]
[HttpGet]
public async Task<IActionResult> GetResumeScreenings(
    [FromQuery] bool unassignedOnly = true,
    [FromQuery] string? statusFilter = null) // Default to true
{
    Console.WriteLine($"Query Parameter Received: unassignedOnly={unassignedOnly}, statusFilter={statusFilter}");

    var query = _context.ResumeScreenings
        .Include(rs => rs.Job)
        .Include(rs => rs.Candidate)
        .AsQueryable();

    if (unassignedOnly) // Default case (fetch only unassigned)
    {
        query = query.Where(rs => rs.ReviewerId == null);
    }
    else // Fetch only assigned
    {
        query = query.Where(rs => rs.ReviewerId != null);

        // Apply additional status filter for assigned records
        if (!string.IsNullOrEmpty(statusFilter))
        {
            query = query.Where(rs => rs.Status == statusFilter);
        }
    }

    var screenings = await query
        .Select(rs => new ResumeScreeningDTO
        {
            ResumeScreeningId = rs.Id, 
            JobId = rs.JobId,  // ✅ Fetch JobId

            JobName = rs.Job != null ? rs.Job.Title : "N/A",
            CandidateName = rs.Candidate != null ? rs.Candidate.Name : "N/A",
            CandidateEmail = rs.Candidate != null ? rs.Candidate.Email : "N/A", // Fetch Email

            Experience = rs.Candidate != null ? rs.Candidate.Experience : 0, // Fetch Experience

            Status = rs.Status,
            ReviewerId = rs.ReviewerId 
        })
    .ToListAsync();
        Console.WriteLine($"Records Found: {screenings.Count}"); // Debugging Log

   if (!screenings.Any()) // Ensure empty result doesn't return 404
    {
        return Ok(new List<ResumeScreeningDTO>());
    }


    return Ok(screenings);
}



[Authorize(Roles = "HR,Admin")]

    [HttpPost("assign-reviewer")]
public async Task<IActionResult> AssignReviewer([FromBody] AssignReviewerDto assignReviewerDto)
{
    // Find the existing resume screening record
    var screening = await _context.ResumeScreenings.FindAsync(assignReviewerDto.ResumeScreeningId);
    if (screening == null)
    {
        return NotFound(new { message = "Resume screening not found" });
    }

    // Assign the reviewer ID
    screening.ReviewerId = assignReviewerDto.ReviewerId;

    // Update status to "In Review"
    screening.Status = "In Review";

    // Save changes in the database
    await _context.SaveChangesAsync();

    return Ok(new { message = "Reviewer assigned successfully" });
}




[HttpGet("candidate-details/{screeningId}")]
    public async Task<ActionResult<CandidateDetailsDto>> GetCandidateDetails(int screeningId)
    {
        var screening = await _context.ResumeScreenings
            .Include(rs => rs.Candidate)
            .ThenInclude(c => c.CandidateSkills)
            .ThenInclude(cs => cs.Skill)
            .FirstOrDefaultAsync(rs => rs.Id == screeningId);

        if (screening == null || screening.Candidate == null)
        {
            return NotFound("Resume screening or candidate not found.");
        }

        var candidate = screening.Candidate;
 // Fetch skills along with experience per skill
    var skills = candidate.CandidateSkills?.Select(cs => new SkillPerExperienceDto
    {
            SkillId = cs.Skill.Id, // ✅ Include SkillId
        SkillName = cs.Skill.Name,
        ExperienceSkill = cs.ExperienceSkill ?? 0 // Default to 0 if null
    }).ToList() ?? new List<SkillPerExperienceDto>();


        var response = new CandidateDetailsDto
        {
            CandidateId = candidate.Id,
            CandidateName = candidate.Name,
            Skills = skills,
            Experience = candidate.Experience,
            Comments = screening.Comments
        };

        return Ok(response);
    }



[Authorize(Roles = "Reviewer,Admin")]

[HttpPost("submit-comment")]
public async Task<IActionResult> SubmitComment([FromBody] SubmitCommentDto request)
{
    var screening = await _context.ResumeScreenings.FindAsync(request.ResumeScreeningId);
    if (screening == null)
    {
        return NotFound(new { message = "Resume Screening not found" });
    }

    // Update comment in ResumeScreening table
    screening.Comments = request.Comment;

    // Update CandidateSkill experience
    foreach (var skillData in request.Skills)
    {
        var candidateSkill = await _context.CandidateSkills
            .FirstOrDefaultAsync(cs => cs.CandidateId == screening.CandidateId && cs.SkillId == skillData.SkillId);

        if (candidateSkill != null)
        {
            candidateSkill.ExperienceSkill = skillData.ExperienceSkill;
        }
    }

    await _context.SaveChangesAsync();
    return Ok(new { message = "Comment and skill experience updated successfully" });
}


[Authorize(Roles = "Reviewer,Admin")]

// PUT: api/resume-screening/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateResumeScreeningStatus(int id, [FromBody] StatusUpdateRequest request)
    {
        var resumeScreening = await _context.ResumeScreenings.FindAsync(id);
        if (resumeScreening == null)
        {
            return NotFound(new { message = "Resume screening record not found." });
        }

        // Only allow valid status updates
        if (request.Status != "Shortlisted" && request.Status != "Rejected")
        {
            return BadRequest(new { message = "Invalid status value. Use 'Shortlisted' or 'Rejected'." });
        }

        resumeScreening.Status = request.Status;
        _context.ResumeScreenings.Update(resumeScreening);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Status updated to {request.Status}.", resumeScreening });
    }




































// [HttpGet]
// public async Task<IActionResult> GetResumeScreenings(
//     [FromQuery] bool unassignedOnly = true,
//     [FromQuery] string? statusFilter = null) // Default to true
// {
//     Console.WriteLine($"Query Parameter Received: unassignedOnly={unassignedOnly}, statusFilter={statusFilter}");

//     var query = _context.ResumeScreenings
//         .Include(rs => rs.Job)
//         .Include(rs => rs.Candidate)
//         .AsQueryable();

//     if (unassignedOnly) // Default case (fetch only unassigned)
//     {
//         query = query.Where(rs => rs.ReviewerId == null);
//     }
//     else // Fetch only assigned
//     {
//         query = query.Where(rs => rs.ReviewerId != null);

//         // Apply additional status filter for assigned records
//         if (!string.IsNullOrEmpty(statusFilter))
//         {
//             query = query.Where(rs => rs.Status == statusFilter);
//         }
//     }

//     var screenings = await query
//         .Select(rs => new ResumeScreeningDTO
//         {
//             ResumeScreeningId = rs.Id, 
//             JobId = rs.JobId,  // ✅ Fetch JobId

//             JobName = rs.Job != null ? rs.Job.Title : "N/A",
//             CandidateName = rs.Candidate != null ? rs.Candidate.Name : "N/A",
//             CandidateEmail = rs.Candidate != null ? rs.Candidate.Email : "N/A", // Fetch Email

//             Experience = rs.Candidate != null ? rs.Candidate.Experience : 0, // Fetch Experience

//             Status = rs.Status,
//             ReviewerId = rs.ReviewerId 
//         })
//     .ToListAsync();
//         Console.WriteLine($"Records Found: {screenings.Count}"); // Debugging Log

//    if (!screenings.Any()) // Ensure empty result doesn't return 404
//     {
//         return Ok(new List<ResumeScreeningDTO>());
//     }


//     return Ok(screenings);
// }



}

public class ResumeScreeningDTO
{
    public int ResumeScreeningId { get; set; } // Unique ID of the screening record

    public int JobId { get; set; }  // ✅ Add JobId

    public string JobName { get; set; } = string.Empty;
    public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty; // Add Candidate Email

    public int Experience { get; set; } // Add Experience Field

    public string Status { get; set; } = string.Empty;
    public int? ReviewerId { get; set; } // Nullable field to show if reviewer is assigned

}


public class AssignReviewerDto
{
    public int ResumeScreeningId { get; set; } // ID of the screening entry
    public int ReviewerId { get; set; }        // Selected reviewer (employee ID)
}


public class CandidateDetailsDto
{
    public int CandidateId { get; set; }
    public string CandidateName { get; set; }
    public List<SkillPerExperienceDto> Skills { get; set; } // Updated to list of objects
    public int Experience { get; set; }
    public string? Comments { get; set; }
}



public class SkillPerExperienceDto
{
        public int SkillId { get; set; } // ✅ Add SkillId

    public string SkillName { get; set; }
    public int ExperienceSkill { get; set; } // Experience per skill
}



public class SubmitCommentDto
{
    public int ResumeScreeningId { get; set; }
    public string Comment { get; set; }
    public List<SkillExperienceDto> Skills { get; set; }
}


// DTO for updating status
public class StatusUpdateRequest
{
    public string Status { get; set; }
}



public class SkillExperienceDto
{
    public int SkillId { get; set; }
    public int ExperienceSkill { get; set; }
}




// public class ResumeScreeningDTO
// {
//     public int ResumeScreeningId { get; set; } // Unique ID of the screening record
//     public string JobName { get; set; } = string.Empty;
//     public string CandidateName { get; set; } = string.Empty;
//         public string CandidateEmail { get; set; } = string.Empty; // Add Candidate Email

//     public int Experience { get; set; } // Add Experience Field

//     public string Status { get; set; } = string.Empty;
//     public int? ReviewerId { get; set; } // Nullable field to show if reviewer is assigned

// }