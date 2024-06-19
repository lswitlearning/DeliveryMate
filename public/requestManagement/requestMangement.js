

let requestList = []

const userToken = localStorage.getItem('token')
// Function to fetch all requests by the current user
async function getAllRequestsByCurrentUser() {
    try {
        const response = await fetch('/api/delivery/getAllRequestsByUser', {
            method: 'GET',
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        }); // Assuming this endpoint returns user details
        const allDeliveryRequestByUser = await response.json();
        console.log(allDeliveryRequestByUser)
        if (allDeliveryRequestByUser && allDeliveryRequestByUser.requests) {

            return allDeliveryRequestByUser.requests;

        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

function createRequestCards() {
    const container = document.getElementById("requestContainer");

    requestList.forEach(request => {
        // Create card element
        const card = document.createElement("div");
        card.className = "card mb-3";

        // Create card content
        const cardContent = `
        <div class="row no-gutters">
            <div class="col-md-4 d-flex align-items-center justify-content-center">
                <img src="${request.itemImage}" class="card-img" alt="Request Image ${request._id}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title"><a href="/request-management/${request._id}">Requested Item Name: ${request.itemName}</a></h5>
                    <p class="card-text">Weight: ${request.itemWeight}</p>
                    <p class="card-text">Size: ${request.itemSize}</p>
                    <p class="card-text">Destination: ${request.itemDestination.name}</p>
                    <p class="card-text">Pick-up: ${request.itemPickup.name}</p>
                    <p class="card-text">Notes: ${request.itemNotes}</p>
                    <p class="card-text">Tips: ${request.itemTips}</p>
                    <p class="card-text">Status: ${request.status}</p>
                    <div class="d-flex">
                        <button class="btn btn-success mr-2" data-toggle="modal" data-target="#editModal${request._id}">Edit</button>
                        <button onclick="deleteRequest('${request._id}')" class="btn btn-danger  mr-2">Delete</button>
                        ${(request.status == 'accepted' || request.status == 'delivered') ? `<button onclick="goToChat('${request._id}')" class="btn btn-primary">Go to Chat</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

        card.innerHTML = cardContent;

        console.log("REQUEST ID:", request._id);

        // Append card to container
        container.appendChild(card);

        // Create corresponding edit modal
        createEditModal(request);
    });
}


// Function to create edit modal for each request
function createEditModal(request) {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = `
        <div class="modal fade" id="editModal${request._id}" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">Edit Request</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    <form id="editform${request._id}">
                        <div class="form-group">
                            <label for="editItemName">Item Name:</label>
                            <input type="text" id="editItemName${request._id}" class="form-control" value="${request.itemName}">
                        </div>
                        <div class="form-group">
                            <label for="editWeight">Weight:</label>
                            <input type="text" id="editWeight${request._id}" class="form-control" value="${request.itemWeight}">
                        </div>
                        <div class="form-group">
                            <label for="editSize">Size:</label>
                            <input type="text" id="editSize${request._id}" class="form-control" value="${request.itemSize}">
                        </div>
                        <div class="form-group">
                            <label for="editDestination">Destination:</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="editDestination${request._id}"
                                name="editDestination" placeholder="Select on map" readonly value="${request.itemDestination.name}">
                        </div>
                        </div>
                        <div class="form-group">
                            <label for="editPickup">Pick-up:</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="editPickUp${request._id}"
                                name="editPickup" placeholder="Select on map" readonly value="${request.itemPickup.name}">
                        </div>
                        </div>
                        <div class="form-group">
                            <label for="editNotes">Notes:</label>
                            <textarea id="editNotes${request._id}" class="form-control" rows="4">${request.itemNotes}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="editTips">Tips:</label>
                            <input type="text" id="editTips${request._id}" class="form-control" value="${request.itemTips}">
                        </div>
                        <div class="form-group">
                            <label for="editImageUrl">Image URL:</label>
                            <input type="file" id="editImageUrl${request._id}" class="form-control" >
                        </div>
                        <button class="btn btn-primary save-changes-button" type="button" >Save Changes</button>
                        </form >
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalContainer);
}


async function goToChat(thereqID) {
    userName = "Sender";
    window.location.href = `/chat?username=${userName}&room=${thereqID}`;
}


// Function to delete request (replace this with actual logic)
function deleteRequest(requestId) {
    alert(`Delete request with ID: ${requestId}`);
}

// Initialize the page
createRequestCards();
// Function to dynamically update the page with requests
async function updatePageWithUserRequests() {
    try {
        const userRequests = await getAllRequestsByCurrentUser();

        if (userRequests.length > 0) {
            // Update the requestList with user-specific requests
            requestList = userRequests;

            // Clear existing request cards
            const container = document.getElementById("requestContainer");
            container.innerHTML = '';

            // Create new cards based on user-specific requests
            createRequestCards();
        } else {
            createRequestCards();
            alert('No requests found for the current user.');


        }
    } catch (error) {
        console.error(error);
    }
}
function saveChanges(requestId) {
    debugger
    const editItemName = document.getElementById(`editItemName${requestId}`).value;
    const editWeight = document.getElementById(`editWeight${requestId}`).value;
    const editSize = document.getElementById(`editSize${requestId}`).value;
    const editDestination = document.getElementById(`editDestination${requestId}`).value;
    const editPickup = document.getElementById(`editPickUp${requestId}`).value;
    const editNotes = document.getElementById(`editNotes${requestId}`).value;
    const editTips = document.getElementById(`editTips${requestId}`).value;

    // Use FormData to capture form data including the file
    var formData = new FormData();
    var fileInput = document.getElementById(`editImageUrl${requestId}`);
    var itemImageFile = fileInput.files[0];

    formData.append('id', requestId);
    formData.append('itemImage', itemImageFile);
    formData.append('itemName', editItemName);
    formData.append('itemWeight', editWeight);
    formData.append('itemSize', editSize);
    formData.append('itemDestination', editDestination);
    formData.append('itemPickup', editPickup);
    formData.append('itemTips', editTips);
    formData.append('itemNotes', editNotes);

    // Make an AJAX request to submit the form data to the server
    $.ajax({
        url: '/api/delivery/submitRequest',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        headers: {
            'authorization': `${userToken}` // Add the token to the headers
        },
        success: function (response) {
            toastr.success(response.message);
            // Reset the form after success
            // Close the modal
            $(`#editModal${requestId}`).modal('hide');

            // Update the page with the new data
            updatePageWithUserRequests();

            const form = modal.querySelector(`editform${requestId}>`);

            // Reset the form
            form.reset();
        },
        error: function (error) {
            toastr.error("Failed to submit request.");
            console.error(error);
        }
    });
}

// Function to delete request
async function deleteRequest(requestId) {
    try {
        const response = await fetch(`/api/delivery/deleteRequest/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Remove the deleted request from the requestList
        requestList = requestList.filter(request => request._id !== requestId);
        debugger
        toastr.success(`Request with ID ${requestId} deleted successfully.`);
        // Update the UI to reflect the changes
        updatePageWithUserRequests();

    } catch (error) {
        console.error('Fetch error:', error);
        // Handle errors, e.g., display an error message to the user
    }
}

// Initialize the page
updatePageWithUserRequests();
// Initialize Leaflet map
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
var selectedInputField;
// Function to open the map and set the selected input field
function openMap(inputField) {
    selectedInputField = inputField;

    // Check if the Geolocation API is available
    if (navigator.geolocation) {
        // Use Geolocation API to get the current location
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                // Center the map at the user's current location
                map.setView([userLat, userLng], 13);

                // Optionally, you can add a marker at the user's location
                L.marker([userLat, userLng]).addTo(map);

                // Show the modal
                $('#mapModal').modal('show');
            },
            function (error) {
                console.error('Error getting user location:', error);
                // If there is an error, still show the modal without centering on the user's location
                $('#mapModal').modal('show');
            }
        );
    } else {
        console.error('Geolocation is not supported by your browser');
        // If Geolocation is not supported, still show the modal without centering on the user's location
        $('#mapModal').modal('show');
    }
}


// // Add an event listener for the "Save Changes" button click using event delegation
document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('save-changes-button')) {
        // Find the closest parent with the 'modal' class
        const modal = event.target.closest('.modal');

        // Ensure that a modal was found
        if (modal) {
            const requestId = modal.id.replace('editModal', ''); // Extract requestId from modal id
            saveChanges(requestId);
        }
    }
});