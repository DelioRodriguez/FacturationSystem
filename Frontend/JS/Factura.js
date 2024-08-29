document.addEventListener('DOMContentLoaded', () => {
    const productosList = document.getElementById('productosList');
    const productosSeleccionados = document.getElementById('productosSeleccionados');
    const totalElem = document.getElementById('total');
    const facturaForm = document.getElementById('facturaForm');
    const API_URL = 'http://localhost:5013/api/Products';

    let productos = [];
    let seleccionados = [];

    // Cargar productos desde el API
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            productos = data;
            renderProductosList();
        })
        .catch(error => console.error('Error al cargar productos:', error));

    function renderProductosList() {
        productosList.innerHTML = '';
        productos.forEach(producto => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${producto.nombre} - $${producto.precio.toFixed(2)}
                <button class="btn btn-success btn-sm" onclick="addProducto(${producto.id})">Agregar</button>
            `;
            productosList.appendChild(li);
        });
    }

    window.addProducto = function(id) {
        const producto = productos.find(p => p.id === id);
        const cantidad = prompt('Ingrese la cantidad:', '1');
        if (producto && cantidad > 0) {
            const cantidadNum = parseInt(cantidad);
            const productoSeleccionado = {
                ...producto,
                cantidad: cantidadNum
            };
            seleccionados.push(productoSeleccionado);
            renderSeleccionados();
        }
    };

    function renderSeleccionados() {
        productosSeleccionados.innerHTML = '';
        let subtotal = 0;
        seleccionados.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            const precioTotal = item.precio * item.cantidad;
            subtotal += precioTotal;
            li.innerHTML = `
                ${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad}
                <button class="btn btn-info btn-sm" onclick="editarProducto(${item.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${item.id})">Eliminar</button>
            `;
            productosSeleccionados.appendChild(li);
        });

        const impuesto = 0.18;
        const total = subtotal * (1 + impuesto);
        totalElem.innerHTML = `
            Subtotal: $${subtotal.toFixed(2)}<br>
            Total con impuestos (18%): $${total.toFixed(2)}
        `;
    }

    window.editarProducto = function(id) {
        const index = seleccionados.findIndex(p => p.id === id);
        if (index !== -1) {
            const cantidad = prompt('Ingrese la nueva cantidad:', seleccionados[index].cantidad);
            if (cantidad > 0) {
                seleccionados[index].cantidad = parseInt(cantidad);
                renderSeleccionados();
            }
        }
    };

    window.eliminarProducto = function(id) {
        seleccionados = seleccionados.filter(p => p.id !== id);
        renderSeleccionados();
    };

    facturaForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const cliente = document.getElementById('cliente').value;
        const datosFactura = {
            cliente,
            productos: seleccionados
        };

        // Actualizar stock en el backend
        fetch('http://localhost:5013/api/ActualizarStock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosFactura)
        })
        .then(response => response.json())
        .then(data => {
            alert('Factura generada y stock actualizado con éxito.');
            // Limpiar la selección y el formulario después de la actualización
            seleccionados = [];
            renderSeleccionados();
            document.getElementById('cliente').value = '';
        })
        .catch(error => console.error('Error al actualizar el stock:', error));
    });
});
