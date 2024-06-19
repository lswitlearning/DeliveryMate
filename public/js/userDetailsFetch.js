var userToken = localStorage.getItem('token');

// Fetch user details from the API with the token in headers
fetch('/api/user/currentUser', {
    method: 'GET',
    headers: {
        'Authorization': userToken,
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 403) {
            handleUnauthorizedUser();
            throw new Error('Unauthorized');
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => {
        // Handle the successful response data
        console.log(data);
        updateNavbarForLoggedInUser();
    })
    .catch(error => {
        // Handle errors
        console.error(error);
    });

function updateNavbarForLoggedInUser() {
    // Change login to logout in the navbar
    const loginLink = document.querySelector('.nav-item a[href="/"]');
    if (loginLink) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#'; // You can set the actual logout endpoint
        loginLink.addEventListener('click', handleLogout);
    }
}

function handleUnauthorizedUser() {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Redirect to the home page
    window.location.href = '/';
}

function handleLogout() {
    // Perform logout logic (e.g., invalidate the session on the server)
    // After successful logout, you can redirect to the home page
    localStorage.removeItem('token');
    window.location.href = '/';
}

