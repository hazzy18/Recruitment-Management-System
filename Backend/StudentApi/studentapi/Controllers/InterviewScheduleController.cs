
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
[ApiController]
[Route("api/interview")]
public class InterviewScheduleController : ControllerBase
{


    private readonly ApplicationDbContext _context;

    public InterviewScheduleController(ApplicationDbContext context)
    {
        _context = context;
    }


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



