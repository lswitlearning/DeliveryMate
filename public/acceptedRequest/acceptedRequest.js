
document.addEventListener('DOMContentLoaded', async () => {

    const userAuth = localStorage.getItem('token')

    try {
        const response = await fetch('/api/user/currentuser', {
            headers: {
                'Authorization': userAuth
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const userData = await response.json();
    }
    catch (error) {
        console.error('Error:', error);
    }
    // Fetch and display accepted requests
    fetchAcceptedRequests();
});

var userToken = localStorage.getItem('token');

async function fetchAcceptedRequests() {
    try {
        const response = await fetch('/api/accepetedRequest', {
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });
        const responseData = await response.json();
        console.log(responseData)
        if (responseData && responseData['acceptedRequests'].length > 0) {

            displayAcceptedRequests(responseData['acceptedRequests']);
        } else {
            displayNoAcceptedRequestsMessage();
        }
    } catch (error) {
        console.error('Error fetching accepted requests:', error);
    }
}

function displayAcceptedRequests(acceptedRequests) {
    const container = document.getElementById('acceptedRequestsContainer');

    // Clear the container before appending new data
    container.innerHTML = '';

    acceptedRequests.forEach(request => {
        const card = document.createElement('div');
        card.className = 'card mb-3';

        const cardContent = `
        <div class="card-body">
            <div class="row">
                <div class="col-md-4">
                    <img src="${request.requestId.itemImage}" alt="Item Image" class="card-img-top">
                </div>
                <div class="col-md-8">
                    <h5 class="card-title">Accepted Request for  "${request.requestId.itemName}" </h5>
                    <p class="card-text">Requested By: ${request.requestId.userId.firstname}</p>
                    <p class="card-text">Requested User Email: ${request.requestId.userId.email}</p>
                    <p class="card-text">Item Pick-Up: ${request.requestId.itemPickup.name}</p>
                    <p class="card-text">Item Destination: ${request.requestId.itemDestination.name}</p>
                    <p class="card-text">Item Weight: ${request.requestId.itemWeight}</p>
                    <p class="card-text">Item Size: ${request.requestId.itemSize}</p>
                    <p class="card-text">Item Tips: ${request.requestId.itemTips}</p>
                    <p class="card-text">Item Notes: ${request.requestId.itemNotes}</p>
                    <p class="card-text">Status: ${request.requestId.status}</p>
                    <p class="card-text">Requested At: ${new Date(request.createdAt).toDateString()}</p>
                    ${request.requestId.status !== 'delivered' ? `<button class="btn btn-danger" onclick="deleteAcceptedRequest('${request.requestId._id}')">Cancel Acceptance</button>
                    <button class="btn btn-warning" onclick="updateAcceptedRequest('${request.requestId._id}')"> Mark Delivered</button>` : ''}
                    <button class="btn btn-success" onclick="openChat('${request.requestId._id}')">Chat</button>
                </div>
            </div>
        </div> `;


        card.innerHTML = cardContent;
        container.appendChild(card);
    });
}

// socket part starts, don't touch this code. 
// for getting the user info
/*
async function getUserInfo() {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch('/api/user/currentuser', {
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const responseData = await response.json();
        console.log(responseData)

        return responseData.username;
    }
    catch (error) {
        console.log("Error:".error);
    }
}
*/

function openChat(thereqID){
    userName="Receiver";
    window.location.href = `/chat?username=${userName}&room=${thereqID}`;
}

// socket part ends. 

function updateUserActivityStatus(isActive) {
    const statusElement = document.getElementById("userActivityStatus");
    statusElement.innerText = `User status:${isActive ? 'Active' : 'Inactive'}`;
}



function displayNoAcceptedRequestsMessage() {
    const container = document.getElementById('acceptedRequestsContainer');
    container.innerHTML = '<p>No accepted requests available.</p>';
}

async function deleteAcceptedRequest(requestId) {
    // Confirm with the user before proceeding with the deletion
    const confirmation = confirm("Are you sure you want to cancel the acceptance?");

    if (!confirmation) {
        return;
    }

    // Send a DELETE request to the server
    fetch(`/api/accepetedRequest/${requestId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': userToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Handle the response from the server        
            toastr.success(data.message)
            // Refresh the page or update the UI as needed
            fetchAcceptedRequests();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            toastr.error(error)
            // Handle errors, e.g., display an error message to the user
        });
}

async function updateAcceptedRequest(requestId) {
    // Confirm with the user before proceeding with the deletion
    const confirmation = confirm("Are you sure you want to mark the item delivered?");

    if (!confirmation) {
        return;
    }

    // Send a DELETE request to the server
    fetch(`/api/delivery/updateRequestDelivered/${requestId}`, {
        method: 'PUT',
        headers: {
            'Authorization': userToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Handle the response from the server        
            toastr.success(data.message)
            // Refresh the page or update the UI as needed
            fetchAcceptedRequests();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            toastr.error(error)
            // Handle errors, e.g., display an error message to the user
        });
}