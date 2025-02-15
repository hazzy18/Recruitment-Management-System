
//-------------------------------------------------------------------------------------------------------------------

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using studentapi.Data;
using System.Net;
using System.Net.Mail;
using System;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/interview")]
public class InterviewScheduleController : ControllerBase
{


    private readonly ApplicationDbContext _context;

    public InterviewScheduleController(ApplicationDbContext context)
    {
        _context = context;
    }


[Authorize(Roles = "Recruiter,Admin")]

    [HttpPost("schedule")]
    public async Task<IActionResult> ScheduleInterview([FromBody] InterviewRequest request)
    {
        if (request == null || request.ResumeScreeningId <= 0 || string.IsNullOrEmpty(request.CandidateEmail) || request.InterviewerEmails == null || request.InterviewerEmails.Count == 0)
        {
            return BadRequest("Invalid request. Ensure all fields are provided.");
        }

        // Find the existing screening record
        var screening = await _context.ResumeScreenings.FindAsync(request.ResumeScreeningId);
        if (screening == null)
        {
            return NotFound("Resume screening record not found.");
        }

        // Update fields in the existing screening record
    screening.InterviewerIds = string.Join(",", request.InterviewerIds);  // Store as comma-separated values
        screening.TotalRounds = request.TotalRounds;
        screening.Status = "Round 1";  // ✅ Update the status to "Round1"


        try
        {
            await _context.SaveChangesAsync(); // Save changes to database


            string subject = "Interview Scheduled";
            string interviewerNames = string.Join(", ", request.InterviewerEmails); // Convert list to string
            string candidateEmailBody = $"Dear Candidate,\n\nYour interview has been scheduled with {interviewerNames} on {request.Time}.\n\nBest Regards,\nRecruitment Team";



            // Send email to candidate
            await SendEmailAsync(request.CandidateEmail, subject, candidateEmailBody);

            // Send email to each interviewer
            foreach (var interviewerEmail in request.InterviewerEmails)
            {
                string interviewerEmailBody = $"Dear Interviewer,\n\nYou have an interview scheduled with {request.CandidateEmail} on {request.Time}.";
                await SendEmailAsync(interviewerEmail, subject, interviewerEmailBody);
            }

        return Ok(new { message = "Interview scheduled, details updated, and emails sent successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Failed to send emails. Error: {ex.Message}");
        }
    }

    private async Task SendEmailAsync(string recipient, string subject, string body)
    {
        using (var client = new SmtpClient("smtp.gmail.com"))
        {
            client.Port = 587; // Common SMTP port
            client.Credentials = new NetworkCredential("lahar0918@gmail.com", "ohcc gysu pqnu lgut");
            client.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = new MailAddress("lahar0918@gmail.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };
            mailMessage.To.Add(recipient);

            await client.SendMailAsync(mailMessage);
        }
    }





[Authorize(Roles = "Interviewer,Admin")]

[HttpPost("evaluate-screening")]
public async Task<IActionResult> EvaluateResumeScreening([FromBody] ResumeScreeningEvaluationDTO request)
{
    if (request.SkillRatings == null || request.SkillRatings.Count == 0)
    {
        return BadRequest("Skill ratings are required.");
    }

    var jobSkills = await _context.JobSkills
        .Where(js => js.JobId == request.JobId)
        .ToListAsync();

    if (jobSkills == null || jobSkills.Count == 0)
    {
        return NotFound("No skills found for this job.");
    }

    // Separate required and preferred skills
    var requiredSkills = jobSkills.Where(js => js.Type == "required").Select(js => js.SkillId).ToList();
    var preferredSkills = jobSkills.Where(js => js.Type == "preferred").Select(js => js.SkillId).ToList();

    // Compute averages for required and preferred skills
    var requiredRatings = request.SkillRatings
        .Where(sr => requiredSkills.Contains(sr.Key))
        .Select(sr => sr.Value)
        .ToList();

    var preferredRatings = request.SkillRatings
        .Where(sr => preferredSkills.Contains(sr.Key))
        .Select(sr => sr.Value)
        .ToList();

    double requiredAvg = requiredRatings.Any() ? requiredRatings.Average() : 0;
    double preferredAvg = preferredRatings.Any() ? preferredRatings.Average() : 0;

    // Check if candidate qualifies
    bool qualifies = requiredAvg >= 3 && preferredAvg > 1;

    // Update resume screening status
    var screening = await _context.ResumeScreenings.FindAsync(request.ResumeScreeningId);
    if (screening == null)
    {
        return NotFound("Resume screening not found.");
    }

     // Extract the current round number from the status (e.g., "Round 1" -> 1)
         int totalRounds = screening.TotalRounds ?? 1;

    int currentRound = 1;


    if (screening.Status.Equals("Final Round", StringComparison.OrdinalIgnoreCase))
    {
        currentRound = totalRounds;  // If "Final Round", set currentRound to totalRounds
    }


    else if (screening.Status.StartsWith("Round"))
    {
        string roundNumberString = new string(screening.Status.Where(char.IsDigit).ToArray());
        if (int.TryParse(roundNumberString, out int roundNum))
        {
            currentRound = roundNum;
        }
    }

    int nextRound = currentRound + 1;

    if (qualifies)
    {
                if (currentRound == totalRounds)
        {
            // ✅ If the candidate clears the final round, mark them as "Selected"
            screening.Status = "Selected";
        }
        else if (nextRound == totalRounds) 
        {
            screening.Status = "Final Round";
        }
        else
        {
            screening.Status = $"Round {nextRound}";
        }
    }
    else
    {
        screening.Status = "Rejected";
    }




    // Fetch existing skill ratings for this screening
    var existingSkillRatings = await _context.ResumeScreeningSkillRatings
        .Where(r => r.ScreeningId == request.ResumeScreeningId)
        .ToListAsync();

    foreach (var skillRating in request.SkillRatings)
    {
        var skillId = skillRating.Key;
        var rating = skillRating.Value;
        var additionalComment = request.SkillComments != null && request.SkillComments.ContainsKey(skillId)
            ? request.SkillComments[skillId]
            : null;

        var existingRating = existingSkillRatings.FirstOrDefault(r => r.SkillId == skillId);

        if (existingRating != null)
        {
            // Update existing record
            existingRating.Rating = rating;
            existingRating.AdditionalComments = additionalComment;
            _context.ResumeScreeningSkillRatings.Update(existingRating);
        }
        else
        {
            // Insert new record if it doesn’t exist
            var newSkillRating = new ResumeScreeningSkillRating
            {
                ScreeningId = request.ResumeScreeningId,
                SkillId = skillId,
                Rating = rating,
                AdditionalComments = additionalComment
            };
            _context.ResumeScreeningSkillRatings.Add(newSkillRating);
        }
    }







    if (request.SkillComments != null && request.SkillComments.Count > 0)
    {
        screening.Comments = string.Join(", ", request.SkillComments.Values.Where(c => !string.IsNullOrWhiteSpace(c)));
    }

    _context.ResumeScreenings.Update(screening);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        ResumeScreeningId = screening.Id,
        Status = screening.Status,
        RequiredAverage = requiredAvg,
        PreferredAverage = preferredAvg,
        Comments = screening.Comments

    });
}





// [HttpPost("evaluate-screening")]
// public async Task<IActionResult> EvaluateResumeScreening([FromBody] ResumeScreeningEvaluationDTO request)
// {
//     if (request.SkillRatings == null || request.SkillRatings.Count == 0)
//     {
//         return BadRequest("Skill ratings are required.");
//     }

//     var jobSkills = await _context.JobSkills
//         .Where(js => js.JobId == request.JobId)
//         .ToListAsync();

//     if (jobSkills == null || jobSkills.Count == 0)
//     {
//         return NotFound("No skills found for this job.");
//     }

//     // Separate required and preferred skills
//     var requiredSkills = jobSkills.Where(js => js.Type == "required").Select(js => js.SkillId).ToList();
//     var preferredSkills = jobSkills.Where(js => js.Type == "preferred").Select(js => js.SkillId).ToList();

//     // Compute averages for required and preferred skills
//     var requiredRatings = request.SkillRatings
//         .Where(sr => requiredSkills.Contains(sr.Key))
//         .Select(sr => sr.Value)
//         .ToList();

//     var preferredRatings = request.SkillRatings
//         .Where(sr => preferredSkills.Contains(sr.Key))
//         .Select(sr => sr.Value)
//         .ToList();

//     double requiredAvg = requiredRatings.Any() ? requiredRatings.Average() : 0;
//     double preferredAvg = preferredRatings.Any() ? preferredRatings.Average() : 0;

//     // Check if candidate qualifies
//     bool qualifies = requiredAvg >= 3 && preferredAvg > 1;

//     // Update resume screening status
//     var screening = await _context.ResumeScreenings.FindAsync(request.ResumeScreeningId);
//     if (screening == null)
//     {
//         return NotFound("Resume screening not found.");
//     }

//      // Extract the current round number from the status (e.g., "Round 1" -> 1)
//          int totalRounds = screening.TotalRounds ?? 1;

//     int currentRound = 1;


//     if (screening.Status.Equals("Final Round", StringComparison.OrdinalIgnoreCase))
//     {
//         currentRound = totalRounds;  // If "Final Round", set currentRound to totalRounds
//     }


//     else if (screening.Status.StartsWith("Round"))
//     {
//         string roundNumberString = new string(screening.Status.Where(char.IsDigit).ToArray());
//         if (int.TryParse(roundNumberString, out int roundNum))
//         {
//             currentRound = roundNum;
//         }
//     }

//     int nextRound = currentRound + 1;

//     if (qualifies)
//     {
//                 if (currentRound == totalRounds)
//         {
//             // ✅ If the candidate clears the final round, mark them as "Selected"
//             screening.Status = "Selected";
//         }
//         else if (nextRound == totalRounds) 
//         {
//             screening.Status = "Final Round";
//         }
//         else
//         {
//             screening.Status = $"Round {nextRound}";
//         }
//     }
//     else
//     {
//         screening.Status = "Rejected";
//     }



//     if (request.SkillComments != null && request.SkillComments.Count > 0)
//     {
//         screening.Comments = string.Join(", ", request.SkillComments.Values.Where(c => !string.IsNullOrWhiteSpace(c)));
//     }

//     _context.ResumeScreenings.Update(screening);
//     await _context.SaveChangesAsync();

//     return Ok(new
//     {
//         ResumeScreeningId = screening.Id,
//         Status = screening.Status,
//         RequiredAverage = requiredAvg,
//         PreferredAverage = preferredAvg,
//         Comments = screening.Comments

//     });
// }




}

// DTO to receive the request
public class InterviewRequest
{
    public int ResumeScreeningId { get; set; } // Existing Screening ID

    public string CandidateEmail { get; set; }

    public List<int> InterviewerIds { get; set; } // Changed from a single `int` to a `List<int>`

    public List<string> InterviewerEmails { get; set; } // Updated to handle multiple interviewers
    public DateTime Time { get; set; }

    public int TotalRounds { get; set; }  // New field

}



public class ResumeScreeningEvaluationDTO
{
    public int ResumeScreeningId { get; set; }
    public int JobId { get; set; }
    public Dictionary<int, int> SkillRatings { get; set; } = new(); // SkillId -> Rating

     public Dictionary<int, string> SkillComments { get; set; } = new(); // 🔹 Add this for comments

}


