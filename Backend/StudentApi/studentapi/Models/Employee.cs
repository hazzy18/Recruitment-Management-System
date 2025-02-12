using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("employee")]
public class Employee
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Role { get; set; } = string.Empty; // Example: "HR", "Interviewer"


    [Required]
    [StringLength(100)]
    public string Designation { get; set; } = string.Empty; // Example: "Senior Recruiter", "Technical Interviewer"

    
    // Navigation property: An employee can review multiple resumes
    public ICollection<ResumeScreening>? ResumeScreenings { get; set; }
}
