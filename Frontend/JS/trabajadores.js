document.addEventListener('DOMContentLoaded', function() {
    const trabajadorForm = document.getElementById('trabajadorForm');
    const trabajadoresTable = document.getElementById('trabajadoresTable');
    let deleteUserId = null;

    
    function loadTrabajadores() {
        fetch('http://localhost:5013/api/Users')
            .then(response => response.json())
            .then(users => {
                trabajadoresTable.innerHTML = ''; 
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-outline-warning btn-sm" onclick="editUser(${user.id})">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="openDeleteModal(${user.id})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    trabajadoresTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error al cargar los trabajadores:', error));
    }

    
    trabajadorForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
        const trabajadorId = document.getElementById('trabajadorId').value;

       
        const currentPasswordHash = document.getElementById('currentPasswordHash').value;

        const userData = {
            id: trabajadorId || 0,
            username: usuario,
            role: role,
            passwordHash: password || currentPasswordHash 
        };

        console.log('Datos enviados:', JSON.stringify(userData)); 

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
            return response.text(); 
        })
        .then(() => {
            trabajadorForm.reset();
            loadTrabajadores(); 
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
        });
    });


    window.editUser = function(id) {
        fetch(`http://localhost:5013/api/Users/${id}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('trabajadorId').value = user.id;
                document.getElementById('usuario').value = user.username;
                document.getElementById('role').value = user.role;
                document.getElementById('password').value = ''; 
                
                const currentPasswordHashInput = document.getElementById('currentPasswordHash');
                if (currentPasswordHashInput) {
                    currentPasswordHashInput.value = user.passwordHash;
                }
            })
            .catch(error => console.error('Error al cargar el usuario:', error));
    };

    
    window.openDeleteModal = function(id) {
        deleteUserId = id;
        $('#confirmDeleteModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    };


    document.getElementById('confirmDeleteButton').addEventListener('click', function() {
        if (deleteUserId) {
            fetch(`http://localhost:5013/api/Users/${deleteUserId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                loadTrabajadores();
                $('#confirmDeleteModal').modal('hide'); 
            })
            .catch(error => console.error('Error al eliminar el usuario:', error));
        }
    });

    loadTrabajadores(); 
});
