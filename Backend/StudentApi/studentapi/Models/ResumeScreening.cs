

//-------------------------------------------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using studentapi.Models;

[Table("resume_screening")]
public class ResumeScreening
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")] // Adding column name for Id

    public int Id { get; set; }

    [Required]
    [Column("job_id")] // Adding column name for JobId

    public int JobId { get; set; }

    [Required]
    [Column("candidate_id")] // Adding column name for CandidateId

    public int CandidateId { get; set; }


    [Column("reviewer_id")] // Adding column name for ReviewerId (nullable)

    public int? ReviewerId { get; set; }//nullable 


    [Column("interviewer_ids")]  // Store multiple interviewer IDs as comma-separated values
    public string? InterviewerIds { get; set; }

    [Column("total_rounds")]
    public int? TotalRounds { get; set; } // Nullable for optional rounds


    [Column("comments")] // Adding column name for Comments

    public string? Comments { get; set; }

    [Required]
    [StringLength(50)]
    [Column("status")] // Adding column name for Status

    public string Status { get; set; } = "Pending"; // Status: Pending, Accepted, Rejected

    [Column("screened_at")] // Adding column name for ScreenedAt

    public DateTime ScreenedAt { get; set; } = DateTime.Now;

    // Navigation Properties
    [ForeignKey("JobId")]
    // [InverseProperty("ResumeScreenings")]

    public JobPosition? Job { get; set; }

    [ForeignKey("CandidateId")]
    // [InverseProperty("ResumeScreenings")]

    public Candidate? Candidate { get; set; }

    [ForeignKey("ReviewerId")]
    // [InverseProperty("ResumeScreenings")]

    public Employee? Reviewer { get; set; }


}
