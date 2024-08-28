document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

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
        console.log('Datos recibidos:', data); // Para depuración

        if (data && data.role) {
            const userRole = data.role;

            if (userRole === 'admin') {
                window.location.href = 'Productos.html';
            } else if (userRole === 'empleado') {
                window.location.href = 'Factura.html';
            } else {
                alert('Rol no reconocido');
            }
        } else {
            alert('Datos de usuario no válidos.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al iniciar sesión. Por favor, revisa tus credenciales.');
    });
});
