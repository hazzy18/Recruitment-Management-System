using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using studentapi.Data;
using System;
[Route("api/reports")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }



[HttpGet("position-wise")]
public async Task<IActionResult> GetPositionWiseReport(
    [FromQuery] DateTime? startDate = null,
    [FromQuery] DateTime? endDate = null,
    [FromQuery] string? technology = null,
    [FromQuery] int? minExperience = null)
{
    var query = _context.ResumeScreenings
        .Include(rs => rs.Job)
        .Include(rs => rs.Candidate)
        .AsQueryable();

    // 🔹 Filter by date range
    if (startDate.HasValue && endDate.HasValue)
    {
        query = query.Where(rs => rs.ScreenedAt >= startDate.Value && rs.ScreenedAt <= endDate.Value);
    }

    // 🔹 Filter by technology (Skill)
    if (!string.IsNullOrEmpty(technology))
    {
        query = query.Where(rs => rs.Candidate.CandidateSkills.Any(cs => cs.Skill.Name == technology));
    }

    // 🔹 Filter by experience
    if (minExperience.HasValue)
    {
        query = query.Where(rs => rs.Candidate.Experience >= minExperience.Value);
    }

    var report = await query
        .GroupBy(rs => rs.Job.Title)
        .Select(g => new
        {
            JobTitle = g.Key,
            TotalApplicants = g.Count(),
            Shortlisted = g.Count(rs => rs.Status == "Shortlisted"),
            Rejected = g.Count(rs => rs.Status == "Rejected"),
            AvgExperience = g.Average(rs => rs.Candidate.Experience)
        })
        .ToListAsync();

    return Ok(report);
}























    // [HttpGet("position-wise")]
    // public async Task<IActionResult> GetPositionWiseReport()
    // {
    //     var reportData = await _context.ResumeScreenings
    //         .Include(rs => rs.Job)
    //         .Include(rs => rs.Candidate)
    //         .GroupBy(rs => rs.Job.Title)
    //         .Select(group => new
    //         {
    //             JobTitle = group.Key,
    //             TotalApplicants = group.Count(),
    //             Shortlisted = group.Count(rs => rs.Status == "Shortlisted"),
    //             Rejected = group.Count(rs => rs.Status == "Rejected"),
    //             AvgExperience = group.Average(rs => rs.Candidate.Experience)
    //         })
    //         .ToListAsync();

    //     return Ok(reportData);
    // }
}
