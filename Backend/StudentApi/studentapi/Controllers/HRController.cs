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
using Microsoft.AspNetCore.StaticFiles;
using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Authorization;



[ApiController]
[Route("api/hr")]
public class HRController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;


    public HRController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;

    }

[Authorize(Roles = "HR,Admin")]

[HttpPost("release-offer/{resumeScreeningId}")]
    public async Task<IActionResult> ReleaseOfferLetter(int resumeScreeningId, [FromBody] OfferLetterRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.JoiningDate))
        {
            return BadRequest("Invalid request. Joining Date is required.");
        }

        // Fetch ResumeScreening and related Candidate
        var screening = await _context.ResumeScreenings
            .Include(rs => rs.Candidate)
            .FirstOrDefaultAsync(rs => rs.Id == resumeScreeningId);

        if (screening == null || screening.Candidate == null)
        {
            return NotFound("Resume screening record or candidate not found.");
        }

        string candidateEmail = screening.Candidate.Email;
        string candidateName = screening.Candidate.Name;

        try
        {
            // Send Email
            string subject = "Offer Letter Released";
            string emailBody = $"Dear {candidateName},\n\nYour offer letter has been released. Your joining date is {request.JoiningDate}.\n\nBest Regards,\nHR Team";

            await SendEmailAsync(candidateEmail, subject, emailBody);

            // Update Screening Status
            screening.Status = "Onboarded";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Offer letter released and email sent successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Failed to send email. Error: {ex.Message}");
        }
    }

    private async Task SendEmailAsync(string recipient, string subject, string body)
    {
        using (var client = new SmtpClient("smtp.gmail.com"))
        {
            client.Port = 587;
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

































[Authorize(Roles = "HR,Admin")]

[HttpGet("download/{resumeScreeningId}")]
public async Task<IActionResult> DownloadDocument(int resumeScreeningId)
{
    // Step 1: Find the ResumeScreening entry and get the Candidate's document path
    var screening = await _context.ResumeScreenings
        .Where(rs => rs.Id == resumeScreeningId)
        .Include(rs => rs.Candidate)
        .FirstOrDefaultAsync();

    if (screening == null || screening.Candidate == null || string.IsNullOrEmpty(screening.Candidate.Document))
    {
        return NotFound("Document not found for the specified candidate.");
    }

    // Step 2: Get the full file path
    string filePath = Path.Combine(_environment.WebRootPath, screening.Candidate.Document.TrimStart('/'));

    if (!System.IO.File.Exists(filePath))
    {
        return NotFound("File does not exist on the server.");
    }

    // Step 3: Determine the MIME type
    string contentType = "application/octet-stream"; // Default binary stream
    new FileExtensionContentTypeProvider().TryGetContentType(filePath, out contentType);

    // Step 4: Return the file as a response
    var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
    return File(fileBytes, contentType, Path.GetFileName(filePath));
}










[Authorize(Roles = "HR,Admin")]

[HttpPut("verify/{resumeScreeningId}")]
public async Task<IActionResult> VerifyResumeScreening(int resumeScreeningId)
{
    // Step 1: Find the ResumeScreening entry
    var screening = await _context.ResumeScreenings
        .FirstOrDefaultAsync(rs => rs.Id == resumeScreeningId);

    if (screening == null)
    {
        return NotFound("Resume screening record not found.");
    }

    // Step 2: Update the status
    screening.Status = "Verified";

    // Step 3: Save changes
    await _context.SaveChangesAsync();

    return Ok(new { message = "Resume screening verified successfully!", screening });
}






}
// Request Model for Joining Date
public class OfferLetterRequest
{
    public string JoiningDate { get; set; }
}