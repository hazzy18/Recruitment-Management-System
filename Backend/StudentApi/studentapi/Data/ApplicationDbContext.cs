using Microsoft.EntityFrameworkCore;
using studentapi.Models;

namespace studentapi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<JobPosition> JobPositions { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<JobSkill> JobSkills { get; set; }


//--------------------------------------------Added
        public DbSet<Employee> Employees { get; set; } // Add Employee Table
    public DbSet<ResumeScreening> ResumeScreenings { get; set; } // Add Screening Table
//---------------------------------------------------

        ////----------------------------------ADDED
        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<CandidateSkill> CandidateSkills { get; set; }
///--------------------------------------------
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JobPosition>()
                .ToTable("job_position")
                .HasMany(j => j.JobSkills)
                .WithOne(js => js.JobPosition)
                .HasForeignKey(js => js.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Skill>()
                .ToTable("skill")
                .HasMany(s => s.JobSkills)
                .WithOne(js => js.Skill)
                .HasForeignKey(js => js.SkillId)
                .OnDelete(DeleteBehavior.Cascade);

//-------------------------------------------Added for basic create post---------------
                // Defining many-to-many relationship between Candidate and Skill
            modelBuilder.Entity<CandidateSkill>()
                .HasOne(cs => cs.Candidate)
                .WithMany(c => c.CandidateSkills)
                .HasForeignKey(cs => cs.CandidateId)
                .OnDelete(DeleteBehavior.Cascade); // If a candidate is deleted, their skills should be removed

            modelBuilder.Entity<CandidateSkill>()
                .HasOne(cs => cs.Skill)
                .WithMany(s => s.CandidateSkills)
                .HasForeignKey(cs => cs.SkillId)
                .OnDelete(DeleteBehavior.Cascade);
//------------------------------------------Added-------------------



//--------------------------------------------------Added for resumescreening----------------------------------
// ResumeScreening Relationships
        modelBuilder.Entity<ResumeScreening>()
            .HasOne(rs => rs.Candidate)
            .WithMany()
            .HasForeignKey(rs => rs.CandidateId);

        modelBuilder.Entity<ResumeScreening>()
            .HasOne(rs => rs.Job)
            .WithMany()
            .HasForeignKey(rs => rs.JobId);

        modelBuilder.Entity<ResumeScreening>()
            .HasOne(rs => rs.Reviewer)
            .WithMany(e => e.ResumeScreenings)
            .HasForeignKey(rs => rs.ReviewerId);
    //------------------------------------------------------------------------

            base.OnModelCreating(modelBuilder);
            
        }
    }
}
