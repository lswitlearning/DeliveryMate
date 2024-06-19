// Reference to the card container
var cardContainer = document.getElementById("cardContainer");

// Fetch the user token from localStorage
var userToken = localStorage.getItem('token');

// Function to handle the acceptance of a request
function acceptRequest(requestId) {
    // Send a POST request to the API to accept the request
    fetch(`/api/accepetedRequest/${requestId}`, {
        method: 'POST',
        headers: {
            'Authorization': userToken,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Handle the response from the server
            console.log(data);
            // You may want to update your UI or take additional actions here
            toastr.success(`Request accepted successfully!`);
            // Optionally, you can remove the card from the UI after accepting
            document.getElementById(`card_${requestId}`).remove();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            // Handle errors, e.g., display an error message to the user
        });
}

// Fetch all delivery requests from the API with token in headers
function fetchAllData() {
    debugger
    fetch(`/api/delivery/getAllRequests`, {
        method: 'GET',
        headers: {
            'Authorization': userToken,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Loop through the fetched data and generate cards
            data.requests.forEach(function (request) {
                generateCard(request);

            });
        })
        .catch(error => {
            console.error('Error fetching delivery requests:', error);
        });
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
document.addEventListener('DOMContentLoaded', function () {
    // Search button click event
    document.getElementById('searchButton').addEventListener('click', function () {
        var searchKeyword = document.getElementById('searchInput').value;
        fetchAndPopulateCards(searchKeyword);
    });
});

// Show All Requests button click event
document.getElementById('showAllButton').addEventListener('click', function () {
    // Clear the search input and fetch all requests
    document.getElementById('searchInput').value = '';
    fetchAndPopulateCards();
});


// Function to fetch and populate cards based on the search keyword
function fetchAndPopulateCards(searchKeyword = '') {
    fetch(`/api/delivery/getAllRequests?search=${searchKeyword}`, {
        method: 'GET',
        headers: {
            'Authorization': userToken,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            cardContainer.innerHTML = ''
            data.requests.forEach(request => {
                generateCard(request);
            });

        })
        .catch(error => {
            console.error('Error fetching delivery requests:', error);
        });
}

// Function to generate a card based on the request data
function generateCard(request) {
    // Create card element
    var cardElement = document.createElement("div");
    cardElement.classList.add("col-md-3");
    cardElement.id = `card_${request._id}`;
    cardElement.innerHTML = `
    <!-- Card HTML content -->
    <div class="card h-100">
        <img src="http://localhost:3000/${request.itemImage}" alt="request" class="image">
        <div class="card-body">
            <ul style="list-style-type:none; text-align:left; padding: 0;">
                <li><strong>Item Name:</strong><a href="/request-management/${request._id}">${request.itemName}</a></li>
                <li><strong>Weight:</strong>${request.itemWeight}</li>
                <li><strong>Size:</strong>${request.itemSize}</li>
                <li><strong>Destination:</strong>${request.itemDestination.name}</li>
                <li><strong>Pick-Up Point:</strong>${request.itemPickup.name}</li>
                <li><strong>Tips:</strong>${request.itemTips}</li>
                <li><strong>Notes:</strong>${request.itemNotes}</li>
            </ul>
        </div>
        <div class="d-flex justify-content-center align-items-center">
            <button type="button" class="btn" onclick="acceptRequest('${request._id}')">Accept request</button>
        </div>
    </div>
`;
    // Append card to the card container
    cardContainer.appendChild(cardElement);
}


fetchAllData()
