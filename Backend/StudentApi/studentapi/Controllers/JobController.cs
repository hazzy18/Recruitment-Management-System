using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Data;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace studentapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobController(ApplicationDbContext context)
        {
            _context = context;
        }




        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] JobPositionDto jobPositionDto)
        {
            if (jobPositionDto == null)
            {
                return BadRequest("Invalid job data.");
            }

            var job = await _context.JobPositions
                .Include(j => j.JobSkills)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound("Job not found.");
            }

            // Update job details
            job.Title = jobPositionDto.Title;
            job.Description = jobPositionDto.Description;
            job.MinExperience = jobPositionDto.MinExperience;
            job.Status = jobPositionDto.Status;
            job.ClosureReason = jobPositionDto.ClosureReason;
            job.UpdatedAt = DateTime.Now;

            // Update job skills if provided
            if (jobPositionDto.JobSkills != null && jobPositionDto.JobSkills.Any())
            {
                // Remove existing skills
                _context.JobSkills.RemoveRange(job.JobSkills);

                // Add new skills
                job.JobSkills = jobPositionDto.JobSkills.Select(js => new JobSkill
                {
                    JobId = job.Id,
                    SkillId = js.SkillId,
                    Type = js.Type
                }).ToList();
            }

            await _context.SaveChangesAsync();
            return Ok(job);
        }







        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(int id)
        {
            var job = await _context.JobPositions
                .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound(new { message = "Job not found" });
            }

            // Map to DTO
            var jobDto = new JobPositionDto
            {
                Title = job.Title,
                Description = job.Description ?? "",
                MinExperience = job.MinExperience,
                Status = job.Status,
                ClosureReason = job.ClosureReason ?? "",
                JobSkills = job.JobSkills?.Select(js => new JobSkillDto
                {
                    SkillId = js.SkillId,
                    Type = js.Type
                }).ToList() ?? new List<JobSkillDto>()
            };

            return Ok(jobDto);
        }
    



//get all jobs 
[HttpGet]
        public async Task<ActionResult<IEnumerable<JobMinimalDto>>> GetAllJobs()
        {
            var jobs = await _context.JobPositions
                .AsNoTracking()
                .Select(job => new JobMinimalDto
                {
                    Id = job.Id,
                    Title = job.Title,
                    MinExperience = job.MinExperience,
                    Status = job.Status
                })
                .ToListAsync();

            return Ok(jobs);
        }



        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] JobPositionDto jobPositionDto)
        {
            if (jobPositionDto == null || jobPositionDto.JobSkills == null || !jobPositionDto.JobSkills.Any())
            {
                return BadRequest("Invalid job data");
            }

            var jobPosition = new JobPosition
            {
                Title = jobPositionDto.Title,
                Description = jobPositionDto.Description,
                MinExperience = jobPositionDto.MinExperience,
                Status = jobPositionDto.Status,
                ClosureReason = jobPositionDto.ClosureReason,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                JobSkills = jobPositionDto.JobSkills.Select(js => new JobSkill
                {
                    SkillId = js.SkillId,
                    Type = js.Type
                }).ToList()
            };

            _context.JobPositions.Add(jobPosition);
            await _context.SaveChangesAsync();

            return Ok(jobPosition);
        }
    }

    public class JobPositionDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MinExperience { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ClosureReason { get; set; }
    public List<JobSkillDto> JobSkills { get; set; } = new List<JobSkillDto>();
}

public class JobSkillDto
{
    public int SkillId { get; set; }
    public string Type { get; set; } = string.Empty;
}

public class JobMinimalDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int MinExperience { get; set; }

    public string Status { get; set; } = string.Empty;
}
    
}
