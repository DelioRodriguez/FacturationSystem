document.addEventListener('DOMContentLoaded', function() {

    const togglePasswordButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePasswordButton.addEventListener('click', function () {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

       const icon = togglePasswordButton.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });


    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const loginData = {
            username: username,
            password: password
        };

        
        clearErrorMessage();

        fetch('http://localhost:5013/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); 

            if (data && data.role) {
                const userRole = data.role;

                if (userRole === 'admin') {
                    window.location.href = 'Productos.html';
                } else if (userRole === 'empleado') {
                    window.location.href = 'Factura.html';
                } else {
                    showError('Rol no reconocido');
                }
            } else {
                showError('Datos de usuario no válidos.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Por favor, revisa tus credenciales.');
        });
    });

    function showError(message) {
        const form = document.getElementById('loginForm');
        const errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.className = 'text-danger mt-2';
        errorElement.textContent = message;
        form.appendChild(errorElement);
    }

    function clearErrorMessage() {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }


    document.getElementById('username').addEventListener('focus', clearErrorMessage);
    document.getElementById('password').addEventListener('focus', clearErrorMessage);
});
