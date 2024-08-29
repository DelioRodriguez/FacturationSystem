using Facturacion.API.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Facturacion.API.Data.Context
{
    public class FacturacionContext : DbContext
    {
        public FacturacionContext(DbContextOptions<FacturacionContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Products> Products { get; set; }
    }
}
