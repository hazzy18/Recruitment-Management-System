using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace studentapi.Models
{
    [Table("candidate")]
    public class Candidate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [Column("experience")]
        public int Experience { get; set; }

        [Column("cv_filepath")]
        public string? CV_FilePath { get; set; } // Stores file path for CV

        [Column("document")]
        public string? Document { get; set; } // Stores file path for document

        [StringLength(255)]
        [Column("password")]
        public string? Password { get; set; } 
 


        // Navigation property for CandidateSkills
        public ICollection<CandidateSkill>? CandidateSkills { get; set; }
    }
}
