document.addEventListener('DOMContentLoaded', function() {
    const trabajadorForm = document.getElementById('trabajadorForm');
    const trabajadoresTable = document.getElementById('trabajadoresTable');

    // Función para cargar trabajadores
    function loadTrabajadores() {
        fetch('http://localhost:5013/api/Users')
            .then(response => response.json())
            .then(users => {
                trabajadoresTable.innerHTML = ''; // Limpiar tabla antes de actualizar
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="btn btn-outline-warning btn-sm" onclick="editUser(${user.id})">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteUser(${user.id})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    `;
                    trabajadoresTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error al cargar los trabajadores:', error));
    }

    // Manejar el envío del formulario
    trabajadorForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
        const trabajadorId = document.getElementById('trabajadorId').value;

        // Obtén la contraseña actual desde un campo oculto si está disponible
        const currentPasswordHash = document.getElementById('currentPasswordHash').value;

        const userData = {
            id: trabajadorId,
            username: usuario,
            role: role,
            passwordHash: password || currentPasswordHash // Usa la contraseña nueva si está disponible, de lo contrario usa la contraseña actual
        };

        console.log('Datos enviados:', JSON.stringify(userData)); // Depuración

        const url = trabajadorId ? `http://localhost:5013/api/Users/${trabajadorId}` : 'http://localhost:5013/api/Users';
        const method = trabajadorId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text(); // Usa text() en lugar de json() si la respuesta puede estar vacía
        })
        .then(() => {
            trabajadorForm.reset();
            loadTrabajadores(); // Asegúrate de que se llama después de la actualización
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
        });
    });

    // Función para editar un usuario
    window.editUser = function(id) {
        fetch(`http://localhost:5013/api/Users/${id}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('trabajadorId').value = user.id;
                document.getElementById('usuario').value = user.username;
                document.getElementById('role').value = user.role;
                document.getElementById('password').value = ''; // No mostrar la contraseña actual por razones de seguridad
                
                // Almacena la contraseña actual en un campo oculto
                const currentPasswordHashInput = document.getElementById('currentPasswordHash');
                if (currentPasswordHashInput) {
                    currentPasswordHashInput.value = user.passwordHash;
                }
            })
            .catch(error => console.error('Error al cargar el usuario:', error));
    };

    // Función para eliminar un usuario
    window.deleteUser = function(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            fetch(`http://localhost:5013/api/Users/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                loadTrabajadores(); // Recargar la tabla después de eliminar un usuario
            })
            .catch(error => console.error('Error al eliminar el usuario:', error));
        }
    };

    loadTrabajadores(); // Cargar los usuarios al inicio
});
