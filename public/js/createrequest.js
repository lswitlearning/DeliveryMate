
// // lock navbar
// $(document).scroll(function () {
//     if ($(this).scrollTop() > 550) {
//         $('header').addClass('scrolled');
//     } else {
//         $('header').removeClass('scrolled');
//     }
// });

//login and signup font effects
const inputs = document.querySelectorAll(".input");

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});
// display submission time on the page
function displaySubmissionTime(time) {
    var timeDisplay = document.getElementById('submissionTimeDisplay');
    if (timeDisplay) {
        timeDisplay.textContent = 'Form submitted successfully at ' + time;
    }
}
// Function called when the form is submitted
async function submitForm(event) {
    event.preventDefault();

    var itemName = document.getElementById('inputName').value;
    var itemWeight = document.getElementById('inputWeight').value;
    var itemSize = document.getElementById('inputSize').value;
    var itemDestination = document.getElementById('itemDestination').value;
    var itemDestinationLatitude = document.getElementById('itemDestinationLatitude').value;
    var itemDestinationLongitude = document.getElementById('itemDestinationLongitude').value;
    var itemPickup = document.getElementById('itemPickup').value;
    var itemPickupLatitude = document.getElementById('itemPickupLatitude').value;
    var itemPickupLongitude = document.getElementById('itemPickupLongitude').value;
    var itemTips = document.getElementById('inputtips').value;
    var itemNotes = document.getElementById('inputnotes').value;
 // Validate form inputs
 if (!itemName || !itemWeight || !itemSize || !itemDestination || !itemPickup || !itemTips || !itemNotes) {
    toastr.error("Please fill in all fields.");
    return;
}
    // Get the current time
    var currentTime = new Date();
    // Format the time using toLocaleString to get the local date and time format
    var formattedTime = currentTime.toLocaleString();

    // Display the submission time on the page
    displaySubmissionTime(formattedTime);

    // Use FormData to capture form data including the file
    var formData = new FormData();
    var fileInput = document.getElementById('fileInput');
    var itemImageFile = fileInput.files[0];
    
    formData.append('itemImage', itemImageFile);
    formData.append('itemName', itemName);
    formData.append('itemWeight', itemWeight);
    formData.append('itemSize', itemSize);
    formData.append('itemDestination', itemDestination);
    formData.append('itemDestinationLatitude', itemDestinationLatitude);
    formData.append('itemDestinationLongitude', itemDestinationLongitude);
    formData.append('itemPickup', itemPickup);
    formData.append('itemPickupLatitude', itemPickupLatitude);
    formData.append('itemPickupLongitude', itemPickupLongitude);
    formData.append('itemTips', itemTips);
    formData.append('itemNotes', itemNotes);

    var token = localStorage.getItem('token');

    // Make an AJAX request to submit the form data to the server
    $.ajax({
        url: '/api/delivery/submitRequest',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        headers: {
            'authorization': `${token}` // Add the token to the headers
        },
        success: function (response) {
            toastr.success(response.message);
            // Reset the form after success
            resetImagePreview();

            document.getElementById('deliveryRequestForm').reset();
            // Handle any additional actions on success
        },
        error: function (error) {
            toastr.error("Failed to submit request.");
            console.error(error);
        }
    });
}
// Function to preview the selected image
function previewSelectedImage() {
    var fileInput = document.getElementById('fileInput');
    var previewImage = document.getElementById('previewImage');

    // Check if a file is selected
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();

        // Set the source of the preview image to the selected file
        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}
// Function to reset the image preview
function resetImagePreview() {
    var fileInput = document.getElementById('fileInput');
    var previewImage = document.getElementById('previewImage');

    // Reset the input file and image preview
    fileInput.value = null;
    previewImage.src = '';
}
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

// Event listener for map click
map.on('click', function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Reverse geocode to get the location name
    reverseGeocode(lat, lng, selectedInputField);
});


// Function to reverse geocode and update the input field
function reverseGeocode(lat, lng, inputField) {
    var geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    $.ajax({
        url: geocodeUrl,
        type: 'GET',
        success: function (response) {
            // Extract the location name from the response
            var locationName = response.display_name;

            // Update the input field with the location name
            $('#' + inputField).val(locationName);

            // Extract and update separate latitude and longitude fields if needed
            var latitudeField = $('#' + inputField + 'Latitude');
            var longitudeField = $('#' + inputField + 'Longitude');

            // Update latitude and longitude fields
            if (latitudeField.length && longitudeField.length) {
                latitudeField.val(lat);
                longitudeField.val(lng);
            }

            // hide the modal
            hideMapModal()
        },
        error: function (error) {
            console.error('Error reverse geocoding:', error);
            // If there is an error, still show the modal without updating the input field
            $('#mapModal').modal('show');
        }
    });
}

// Function to hide the map modal
function hideMapModal() {
    $('#mapModal').modal('hide');
}

// Attach the submitForm function to the form's submit event
document.getElementById('deliveryRequestForm').addEventListener('submit', submitForm);
