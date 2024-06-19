var expect = require("chai").expect;
var request = require("request");

describe("Accepted Request Controller Tests", function () {
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
    it("should accept request", function (done) {
        const existingRequestId = '65c185cfc2f7a199128a7e41';

        request.get({
            url: baseUrl + `/api/accepetedRequest/${existingRequestId}`,
            headers: {
                'authorization': authToken
            }
        }, function (error, response, body) {
            if(response.statusCode==200){
                expect(response.statusCode).to.equal(200);
                expect(body).to.have.property('message').eql('Request accepted successfully!');
            }
            if(response.statusCode==400){
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('message').eql('Request already accepted');
            }
            done();
        });
    });

    it("should get all accepted request", function (done) {

        request.get({
            url: baseUrl + `/api/accepetedRequest`,
            headers: {
                'authorization': authToken
            }
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            body = JSON.parse(body)
            expect(body.acceptedRequests).to.be.an('array');
            done();
        });
    });
})