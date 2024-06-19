var expect = require("chai").expect;
var request = require("request");

describe("Delivery Request Controller Tests", function () {
    var baseUrl = "http://localhost:3000";  // Update with your actual base URL
    var authToken;  // Token to be used for authentication

    // Mocha hooks for setup and teardown
    before(function (done) {
        // Perform user login and get the authentication token
        const loginData = {
            username: 'testuser',
            password: 'testpassword',
        };

        request.post({
            url: baseUrl + "/api/user/login",
            json: loginData
        }, function (error, response, body) {
            authToken = body.data.token;
            done();
        });
    });

    it("should submit a new delivery request with image", function (done) {
        const currentPath = process.cwd();

        const deliveryRequestData = {
            itemName: 'Test Item',
            itemWeight: '5 kg',
            itemSize: 'Medium',
            itemDestination: 'Test Destination',
            itemPickup: 'Test Pickup',
            itemPickupLatitude: 123.456,
            itemPickupLongitude: -78.901,
            itemDestinationLatitude: 12.345,
            itemDestinationLongitude: -67.890,
            itemTips: 'Extra tip',
            itemNotes: 'Handle with care',
            // Add other required fields...
        };

        const formData = {
            ...deliveryRequestData,
            itemImage: {
                value: require('fs').createReadStream(`${currentPath}/testImage/computer-laptop-4281958135.png`),
                options: {
                    filename: 'image.jpg',
                    contentType: 'image/jpeg',
                }
            }
        };

        request.post({
            url: baseUrl + "/api/delivery/submitRequest",
            headers: {
                'Authorization': authToken
            },
            formData: formData
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(201);
            body = JSON.parse(body)
            expect(body).to.have.property('message').eql('Request submitted successfully!');
            done();
        });
    });


    // Test for updateDeliveryStatus function
    it("should update the delivery status", function (done) {
        // Assuming you have a delivery request ID to test with
        const existingRequestId = '65c185cfc2f7a199128a7e41';

        request.put({
            url: baseUrl + `/api/delivery/updateRequestDelivered/${existingRequestId}`,
            headers: {
                'authorization': authToken
            }
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            body = JSON.parse(body)
            expect(body).to.have.property('message').eql('Request Updated Status successfully');
            done();
        });
    });
});
