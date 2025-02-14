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
[Route("api/history")]
public class HistoryController : ControllerBase
{


    private readonly ApplicationDbContext _context;

    public HistoryController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet("get-skill-ratings/{resumeScreeningId}")]
public async Task<IActionResult> GetSkillRatingsByScreeningId(int resumeScreeningId)
{
    var skillRatings = await _context.ResumeScreeningSkillRatings
        .Where(r => r.ScreeningId == resumeScreeningId)
        .Select(r => new
        {
            SkillId = r.SkillId,
            SkillName = r.Skill.Name,
            Rating = r.Rating,
            AdditionalComments = r.AdditionalComments
        })
        .ToListAsync();

    if (skillRatings == null || skillRatings.Count == 0)
    {
        return NotFound("No skill ratings found for this resume screening.");
    }

    return Ok(skillRatings);
}

}