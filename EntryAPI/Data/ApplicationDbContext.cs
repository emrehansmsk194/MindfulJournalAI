using EntryAPI.Models;
using Microsoft.EntityFrameworkCore;


namespace EntryAPI.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions options) : base(options)
		{
		}
		public DbSet<Entry> Entries { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<AIAnalysis> AIAnalyses { get; set; }
		public DbSet<Recommendation> Recommendations { get; set; }
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			
			modelBuilder.Entity<Entry>()
				.HasOne(e => e.User)
				.WithMany(u => u.Entries)
				.HasForeignKey(e => e.UserId)
				.OnDelete(DeleteBehavior.Cascade);

			
			modelBuilder.Entity<User>()
				.HasIndex(u => u.Email)
				.IsUnique();


			modelBuilder.Entity<AIAnalysis>()
				.HasIndex(a => a.EntryId)
				.IsUnique();

			
			modelBuilder.Entity<AIAnalysis>()
				.HasOne(a => a.Entry)
				.WithOne(e => e.AIAnalysis)
				.HasForeignKey<AIAnalysis>(a => a.EntryId)
				.OnDelete(DeleteBehavior.Cascade);
		}

	}
}
