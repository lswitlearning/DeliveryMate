const userToken = localStorage.getItem('token')
// Function to fetch all requests by the current user
function extractIdFromRoute() {
    // Get the current path
    const currentPath = window.location.pathname;

    // Assuming your route structure is like "/request-management/:id"
    const pathSegments = currentPath.split('/');

    // Find the segment containing the ID
    const idSegmentIndex = pathSegments.indexOf('request-management') + 1;

    // Extract the ID
    const id = idSegmentIndex >= 1 ? pathSegments[idSegmentIndex] : null;

    return id;
}
async function getRequestById() {
    try {
        const response = await fetch(`/api/delivery/getById/${extractIdFromRoute()}`, {
            method: 'GET',
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        }); // Assuming this endpoint returns user details
        const data = await response.json();
        console.log(data)
        if (data && data.request) {

            const request = data.request;

            // Populate placeholders with data
            document.getElementById('itemName').innerText = request.itemName;
            document.getElementById('userDetails').innerText = `${request.userId.firstname} ${request.userId.lastname} (${request.userId.email})`;

            document.getElementById('itemWeight').innerText = request.itemWeight;
            document.getElementById('itemSize').innerText = request.itemSize;
            document.getElementById('itemTips').innerText = request.itemTips;
            document.getElementById('itemNotes').innerText = request.itemNotes;
            document.getElementById('status').innerText = request.status;
            document.getElementById('itemDestination').innerText = request.itemDestination.name;
            document.getElementById('itemPickup').innerText = request.itemPickup.name;
            document.getElementById('submissionTime').innerText = request.submissionTime;
            // Assuming data.itemImage is the URL of the item image received from the API
            const itemImageElement = document.getElementById('itemImage');
            itemImageElement.src = `http://localhost:3000/${request.itemImage}`;

            // Initialize Leaflet map
            const map = L.map('map').setView([request.itemPickup.latitude, request.itemPickup.longitude], 13);

            // Add a tile layer to the map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add markers for pickup and destination locations
            const pickupMarker = L.marker([request.itemPickup.latitude, request.itemPickup.longitude])
                .bindPopup(`<b>Pickup Location:</b><br>${request.itemPickup.name}`).addTo(map);

            const destinationMarker = L.marker([request.itemDestination.latitude, request.itemDestination.longitude])
                .bindPopup(`<b>Destination Location:</b><br>${request.itemDestination.name}`).addTo(map);

        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}
getRequestById()