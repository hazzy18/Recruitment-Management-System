using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Data;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/employees")]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ API to get employees with role "Reviewer"
    [HttpGet("reviewers")]
    public async Task<IActionResult> GetReviewers()
    {
        var reviewers = await _context.Employees
            .Where(e => e.Role == "Reviewer")
            .Select(e => new { e.Id, e.Name }) // Fetch only Id & Name
            .ToListAsync();

        return Ok(reviewers);
    }


    // GET: api/employees/interviewers
    [HttpGet("interviewers")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetInterviewers()
    {
        var interviewers = await _context.Employees
                                         .Where(e => e.Role == "Interviewer")
                                         .Select(e => new EmployeeDto
                                         {
                                             Id = e.Id,
                                             Name = e.Name,
                                             Email = e.Email,
                                             Designation = e.Designation
                                         })
                                         .ToListAsync();

        if (interviewers == null || interviewers.Count == 0)
        {
            return NotFound(new { message = "No interviewers found" });
        }

        return Ok(interviewers);
    }
}

public class EmployeeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
}
