using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace studentapi.Models
{

    [Table("job_position")]

    public class JobPosition
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Column("title")]

        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("min_experience")]

        public int MinExperience { get; set; }

        [Required]
        [StringLength(50)]
        [Column("status")]

        public string Status { get; set; } = string.Empty;

        [Column("closure_reason")]
        public string? ClosureReason { get; set; }

        [Column("created_at",TypeName = "datetime")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at",TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public ICollection<JobSkill>? JobSkills { get; set; }

        public static implicit operator int(JobPosition v)
        {
            throw new NotImplementedException();
        }
    }
}
