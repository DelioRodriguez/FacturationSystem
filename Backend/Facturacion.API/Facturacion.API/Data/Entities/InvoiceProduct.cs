namespace Facturacion.API.Data.Entities
{
    public class InvoiceProduct
    {
        public int InvoiceId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public Invoice Invoice { get; set; }
        public Products Product { get; set; }
    }
}
