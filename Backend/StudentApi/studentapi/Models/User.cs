using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace studentapi.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("UserID")]
        public int UserID { get; set; }

        [Required]
        [StringLength(255)]
        [Column("Username", TypeName = "NVARCHAR(255)")]

        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(512)]
        [Column("Password", TypeName = "NVARCHAR(512)")]

        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
                [Column("Email", TypeName = "NVARCHAR(255)")]

        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
                [Column("Role", TypeName = "NVARCHAR(50)")]

        public string Role { get; set; } = string.Empty;

        [Column("IsActive")]
        public bool IsActive { get; set; } = true;

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
