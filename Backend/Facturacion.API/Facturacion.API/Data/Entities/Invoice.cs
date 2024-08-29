namespace Facturacion.API.Data.Entities
{
    public class Invoice
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public DateTime InvoiceDate { get; set; }

        public Client Client { get; set; }
        public ICollection<InvoiceProduct> InvoiceProducts { get; set; }
    }
}
