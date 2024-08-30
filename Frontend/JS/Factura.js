document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    cargarClientes();

    const productosList = document.getElementById('productosList');
    const productosSeleccionados = document.getElementById('productosSeleccionados');
    const subtotalElement = document.getElementById('subtotal');
    const itbisElement = document.getElementById('itbis');
    const totalElement = document.getElementById('total');
    let subtotal = 0;
    let itbis = 0;

    productosList.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'LI') {
            const productId = e.target.getAttribute('data-id');
            const productName = e.target.textContent;
            const productPrice = parseFloat(e.target.getAttribute('data-price'));

            
            const existingProduct = productosSeleccionados.querySelector(`li[data-id="${productId}"]`);

            if (existingProduct) {
               
                const quantityElement = existingProduct.querySelector('.quantity');
                if (quantityElement) {
                    const currentQuantity = parseInt(quantityElement.textContent, 10);
                    const newQuantity = currentQuantity + 1;
                    quantityElement.textContent = newQuantity;

                   
                    const subtotalElement = existingProduct.querySelector('.subtotal');
                    if (subtotalElement) {
                        const newProductSubtotal = (productPrice * newQuantity).toFixed(2);
                        subtotalElement.textContent = `$${newProductSubtotal}`;
                    }

                    const itbisElement = existingProduct.querySelector('.itbis');
                    if (itbisElement) {
                        const productItbis = (productPrice * 0.18 * newQuantity).toFixed(2);
                        itbisElement.textContent = `$${productItbis}`;
                    }

                   
                    updateTotals();
                }
            } else {
               
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.setAttribute('data-id', productId);
                li.setAttribute('data-price', productPrice);
                li.innerHTML = `
                    ${productName} - $${productPrice.toFixed(2)}
                    <span>
                        Cantidad: <span class="quantity">1</span> | Subtotal: <span class="subtotal">$${productPrice.toFixed(2)}</span> | ITBIS: <span class="itbis">$${(productPrice * 0.18).toFixed(2)}</span>
                    </span>
                `;
                productosSeleccionados.appendChild(li);

                
                subtotal += productPrice;
                itbis += productPrice * 0.18;
                subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
                itbisElement.textContent = `$${itbis.toFixed(2)}`;
                totalElement.textContent = `$${(subtotal + itbis).toFixed(2)}`;
            }
        }
    });

    productosSeleccionados.addEventListener('click', function(e) {
        if (e.target && e.target.closest('li')) {
            const li = e.target.closest('li');
            const productPrice = parseFloat(li.getAttribute('data-price'));
            const quantityElement = li.querySelector('.quantity');
            const currentQuantity = quantityElement ? parseInt(quantityElement.textContent, 10) : 0;

            if (currentQuantity > 1) {
               
                const newQuantity = currentQuantity - 1;
                quantityElement.textContent = newQuantity;

  
                const subtotalElement = li.querySelector('.subtotal');
                if (subtotalElement) {
                    const newProductSubtotal = (productPrice * newQuantity).toFixed(2);
                    subtotalElement.textContent = `$${newProductSubtotal}`;
                }

                const itbisElement = li.querySelector('.itbis');
                if (itbisElement) {
                    const productItbis = (productPrice * 0.18 * newQuantity).toFixed(2);
                    itbisElement.textContent = `$${productItbis}`;
                }

            
                updateTotals();
            } else {
         
                productosSeleccionados.removeChild(li);

          
                updateTotals();
            }
        }
    });

    function updateTotals() {
        subtotal = 0;
        itbis = 0;

        const productos = document.getElementById('productosSeleccionados').querySelectorAll('li');

        productos.forEach(producto => {
            const productPrice = parseFloat(producto.getAttribute('data-price'));
            const productQuantity = parseInt(producto.querySelector('.quantity').textContent, 10);
            const productSubtotal = productPrice * productQuantity;
            const productItbis = productPrice * 0.18 * productQuantity;

            subtotal += productSubtotal;
            itbis += productItbis;
        });

        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
        if (itbisElement) {
            itbisElement.textContent = `$${itbis.toFixed(2)}`;
        }
        if (totalElement) {
            totalElement.textContent = `$${(subtotal + itbis).toFixed(2)}`;
        }
    }

    document.getElementById('facturaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generarPDF();
        actualizarInventario();
    });

    function actualizarInventario() {
        const productos = document.getElementById('productosSeleccionados').querySelectorAll('li');

        productos.forEach(producto => {
            const productId = producto.getAttribute('data-id');
            const quantity = parseInt(producto.querySelector('.quantity').textContent, 10);

        
            fetch(`http://localhost:5013/api/Products/${productId}/update-stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cantidadVendida: quantity })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el inventario');
                }
                return response.json();
            })
            .then(data => {
                console.log('Inventario actualizado:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    function generarPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const cliente = document.getElementById('cliente').selectedOptions[0].text;
        const productos = document.getElementById('productosSeleccionados').querySelectorAll('li');
        const subtotal = document.getElementById('subtotal') ? document.getElementById('subtotal').textContent : `$0.00`;
        const itbis = document.getElementById('itbis') ? document.getElementById('itbis').textContent : `$0.00`;
        const total = document.getElementById('total') ? document.getElementById('total').textContent : `$0.00`;


        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('Factura', 105, 20, { align: 'center' });


        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`Cliente: ${cliente}`, 20, 40);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 50);


        const tableColumn = ["Producto", "Precio Unitario", "Cantidad", "Subtotal", "ITBIS"];
        const tableRows = [];

        productos.forEach((producto) => {
            const productName = producto.textContent.split(' - ')[0];
            const productPrice = parseFloat(producto.getAttribute('data-price')).toFixed(2);
            const productQuantity = parseInt(producto.querySelector('.quantity').textContent, 10);
            const productSubtotal = (productPrice * productQuantity).toFixed(2);
            const productItbis = (productPrice * 0.18 * productQuantity).toFixed(2);

            const rowData = [
                productName,
                `$${productPrice}`,
                productQuantity.toString(),
                `$${productSubtotal}`,
                `$${productItbis}`
            ];

            tableRows.push(rowData);
        });

        // Renderizar la tabla
        doc.autoTable({
            startY: 60,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            styles: { fontSize: 12, cellPadding: 3 },
            tableLineColor: [44, 62, 80],
            tableLineWidth: 0.1
        });

 
        doc.text(`Subtotal: ${subtotal}`, 20, doc.previousAutoTable.finalY + 10);
        doc.text(`ITBIS: ${itbis}`, 20, doc.previousAutoTable.finalY + 20);
        doc.text(`Total: ${total}`, 20, doc.previousAutoTable.finalY + 30);

        doc.save('factura.pdf');
    }

    function cargarProductos() {
        fetch('http://localhost:5013/api/Products')
            .then(response => response.json())
            .then(data => {
                productosList.innerHTML = '';
                data.forEach(producto => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = producto.name;
                    li.setAttribute('data-id', producto.id);
                    li.setAttribute('data-price', producto.price);
                    productosList.appendChild(li);
                });
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    function cargarClientes() {
        fetch('http://localhost:5013/api/Clients')
            .then(response => response.json())
            .then(data => {
                const clienteSelect = document.getElementById('cliente');
                data.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente.id;
                    option.textContent = cliente.name;
                    clienteSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar los clientes:', error));
    }
});
