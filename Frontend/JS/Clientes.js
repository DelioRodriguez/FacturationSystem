document.addEventListener('DOMContentLoaded', () => {
    const clienteForm = document.getElementById('clienteForm');
    const clientesTable = document.getElementById('clientesTable');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let clienteIdToDelete = null;

    // Función para cargar clientes
    function loadClientes() {
        fetch('http://localhost:5013/api/Clients')
            .then(response => response.json())
            .then(data => {
                console.log('Clientes recibidos:', data); // Verifica los datos
                clientesTable.innerHTML = ''; // Limpiar tabla
                if (data.length === 0) {
                    clientesTable.innerHTML = '<tr><td colspan="4" class="text-center">No hay clientes disponibles</td></tr>';
                } else {
                    data.forEach(cliente => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${cliente.name || 'No disponible'}</td>
                            <td>${cliente.email || 'No disponible'}</td>
                            <td>${cliente.phone || 'No disponible'}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editCliente(${cliente.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="confirmDelete(${cliente.id})">Eliminar</button>
                            </td>
                        `;
                        clientesTable.appendChild(row);
                    });
                }
            })
            .catch(error => console.error('Error loading clients:', error));
    }

    // Manejar el envío del formulario
    clienteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const clienteId = document.getElementById('clienteId').value.trim();
        const clienteData = {
            id: clienteId || 0,
            name: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('telefono').value.trim()
        };

        const method = clienteId ? 'PUT' : 'POST';
        const url = clienteId ? `http://localhost:5013/api/Clients/${clienteId}` : 'http://localhost:5013/api/Clients';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        })
        .then(response => {
            if (response.status === 204) {
                // Respuesta sin contenido, la solicitud fue exitosa
                return;
            }
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json(); // Manejar la respuesta JSON si no es vacía
        })
        .then(() => {
            clienteForm.reset(); // Limpiar formulario después de enviar
            document.getElementById('clienteId').value = ''; // Limpiar campo oculto
            loadClientes(); // Actualizar tabla después de guardar los cambios
        })
        .catch(error => console.error('Error saving client:', error));
    });

    // Editar un cliente
    window.editCliente = function(id) {
        fetch(`http://localhost:5013/api/Clients/${id}`)
            .then(response => response.json())
            .then(cliente => {
                console.log('Cliente recibido para edición:', cliente); // Verifica los datos
                document.getElementById('nombre').value = cliente.name || '';
                document.getElementById('email').value = cliente.email || '';
                document.getElementById('telefono').value = cliente.phone || '';
                document.getElementById('clienteId').value = cliente.id || '';
            })
            .catch(error => console.error('Error fetching client:', error));
    };

    // Confirmar eliminación de un cliente
    window.confirmDelete = function(id) {
        clienteIdToDelete = id;
        $('#confirmDeleteModal').modal('show');
    };

    // Eliminar un cliente
    confirmDeleteButton.addEventListener('click', () => {
        fetch(`http://localhost:5013/api/Clients/${clienteIdToDelete}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                // Respuesta sin contenido, la eliminación fue exitosa
                return;
            }
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
        })
        .then(() => {
            $('#confirmDeleteModal').modal('hide');
            loadClientes(); // Actualizar tabla después de eliminar el cliente
        })
        .catch(error => console.error('Error deleting client:', error));
    });

    // Cargar clientes al iniciar
    loadClientes();
});
