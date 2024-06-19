// Function to display a notification using Toastr
var userToken = localStorage.getItem('token');

function fetchAllNotification(){
    fetch('/api/notification', {
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
            data.notifications.forEach(element => {
                appendNotificationToContainer(element);

            });

        })
        .catch(error => {
            // Handle errors
            console.error(error);
        });
}
// Function to append a notification to the HTML container
function appendNotificationToContainer(notification) {
    // Create a new notification element
    var notificationElement = document.createElement("div");
    notificationElement.classList.add("notification-item");
    notificationElement.innerHTML = `
        <strong>${notification.title}:</strong> ${notification.message}
    `;

    // Append the notification to the container
    document.getElementById("notification-container").appendChild(notificationElement);
}
fetchAllNotification()