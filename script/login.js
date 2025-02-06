document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Form submitted');

    const username = event.target.username.value;
    const password = event.target.password.value;

    console.log('Username:', username);
    console.log('Password:', password);

    try {
        const response = await fetch('http://127.0.0.1:3001/proxy/auth', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            console.log('Login successful');
            const data = await response.json();
            const token = data.token;
            console.log('Token:', token);

            localStorage.setItem('token', token);

            window.location.href = '../data.html'; 
        } else {
            const errorData = await response.json();
            console.error('Login failed. Status:', response.status, 'Error:', errorData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});