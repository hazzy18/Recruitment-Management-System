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

[HttpPost("schedule")]
public async Task<IActionResult> ScheduleInterview([FromBody] InterviewRequest request)
{
    if (request == null || string.IsNullOrEmpty(request.CandidateEmail) || request.InterviewerEmails == null || request.InterviewerEmails.Count == 0)
    {
        return BadRequest("Invalid request. Ensure all fields are provided.");
    }

    string subject = "Interview Scheduled";
    string interviewerNames = string.Join(", ", request.InterviewerEmails); // Convert list to string
    string candidateEmailBody = $"Dear Candidate,\n\nYour interview has been scheduled with {interviewerNames} on {request.Time}.\n\nBest Regards,\nRecruitment Team";

    try
    {
        // Send email to candidate
        await SendEmailAsync(request.CandidateEmail, subject, candidateEmailBody);

        // Send email to each interviewer
        foreach (var interviewerEmail in request.InterviewerEmails)
        {
            string interviewerEmailBody = $"Dear Interviewer,\n\nYou have an interview scheduled with {request.CandidateEmail} on {request.Time}.";
            await SendEmailAsync(interviewerEmail, subject, interviewerEmailBody);
        }

        return Ok(new { message = "Interview scheduled and emails sent successfully." });
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
    public string CandidateEmail { get; set; }
    public List<string> InterviewerEmails { get; set; } // Updated to handle multiple interviewers
    public DateTime Time { get; set; }
}



