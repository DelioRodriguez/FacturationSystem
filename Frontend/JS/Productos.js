document.addEventListener('DOMContentLoaded', function() {
    const productoForm = document.getElementById('productoForm');
    const productosTable = document.getElementById('productosTable');
    let productoIdToDelete = null;

    // Función para cargar productos
    function loadProductos() {
        fetch('http://localhost:5013/api/Products')
            .then(response => response.json())
            .then(productos => {
                productosTable.innerHTML = ''; // Limpiar tabla antes de actualizar
                productos.forEach(producto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${producto.name || 'Nombre no disponible'}</td>
                        <td>${producto.price !== undefined && producto.price !== null ? producto.price.toFixed(2) : 'N/A'}</td>
                        <td>${producto.amount !== undefined && producto.amount !== null ? producto.amount : 'N/A'}</td>
                        <td>
                            <button class="btn btn-outline-info btn-sm" onclick="editProducto(${producto.id})">
                                <i class="fas fa-pencil-alt"></i> <!-- Icono de lápiz -->
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="showDeleteModal(${producto.id})">
                                <i class="fas fa-trash-alt"></i> <!-- Icono de zafacón -->
                            </button>
                        </td>
                    `;
                    productosTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    // Manejar el envío del formulario
    productoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('nombre').value.trim();
        const price = parseFloat(document.getElementById('precio').value.trim());
        const amount = parseInt(document.getElementById('cantidad').value.trim(), 10);
        const productoId = document.getElementById('productoId').value;

        if (!name || isNaN(price) || isNaN(amount)) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        const productoData = {
            name: name,
            price: price,
            amount: amount
        };

        const url = productoId ? `http://localhost:5013/api/Products/${productoId}` : 'http://localhost:5013/api/Products';
        const method = productoId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text(); // Usa text() en lugar de json() si la respuesta puede estar vacía
        })
        .then(() => {
            productoForm.reset();
            loadProductos(); // Asegúrate de que se llama después de la actualización
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
        });
    });

    // Función para editar un producto
    window.editProducto = function(id) {
        fetch(`http://localhost:5013/api/Products/${id}`)
            .then(response => response.json())
            .then(producto => {
                document.getElementById('productoId').value = producto.id;
                document.getElementById('nombre').value = producto.name || '';
                document.getElementById('precio').value = producto.price !== undefined && producto.price !== null ? producto.price : '';
                document.getElementById('cantidad').value = producto.amount !== undefined && producto.amount !== null ? producto.amount : '';
            })
            .catch(error => console.error('Error al cargar el producto:', error));
    };

    // Función para mostrar el modal de confirmación de eliminación
    window.showDeleteModal = function(id) {
        productoIdToDelete = id;
        $('#confirmDeleteModal').modal('show');
    };

    // Función para eliminar un producto
    document.getElementById('confirmDeleteButton').addEventListener('click', function() {
        fetch(`http://localhost:5013/api/Products/${productoIdToDelete}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            $('#confirmDeleteModal').modal('hide');
            loadProductos(); // Recargar la tabla después de eliminar un producto
        })
        .catch(error => console.error('Error al eliminar el producto:', error));
    });

    loadProductos(); // Cargar los productos al inicio
});
