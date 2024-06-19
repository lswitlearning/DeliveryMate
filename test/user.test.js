var expect = require("chai").expect;
var request = require("request");

describe("User Controller Tests", function () {
    var baseUrl = "http://localhost:3000";  // Update with your actual base URL
    var authToken;  // Variable to store the authentication token

    // it("should register a new user", function (done) {
    //     const userData = {
    //         email: 'test1@example.com',
    //         username: 'test1user',
    //         password: 'test1password',
    //         firstname: 'John',
    //         lastname: 'Doe',
    //         phonenumber: '1234567890',
    //     };

    //     request.post({
    //         url: baseUrl + "/api/user/register",
    //         json: userData
    //     }, function (error, response, body) {
    //         expect(response.statusCode).to.equal(200);
    //         expect(body).to.have.property('statusCode').eql(200);
    //         expect(body.data).to.have.property('_id');
    //         expect(body.data).to.have.property('token');
    //         done();
    //     });
    // });

    // Add similar tests for other controller functions

    it("should login an existing user", function (done) {
        const loginData = {
            username: 'testuser',
            password: 'testpassword',
        };

        request.post({
            url: baseUrl + "/api/user/login",
            json: loginData
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.have.property('statusCode').eql(200);
            expect(body.data).to.have.property('token');
            authToken = body.data.token;
            done();
        });
    });
    it("should get all users", function (done) {
        request.get({
            url: baseUrl + "/api/user/allUsers",
            headers: {
                'authorization': authToken,
            }
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            body = JSON.parse(body)
            expect(body).to.have.property('statusCode').eql(200);
            expect(body.data).to.be.an('array');
            done();
        });
    });

    it("should get current user", function (done) {
        request.get({
            url: baseUrl + "/api/user/currentUser",
            headers: { Authorization: authToken },  // Attach the authentication token
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            body = JSON.parse(body)
            expect(body).to.have.property('statusCode').eql(200);
            expect(body.data).to.have.property('_id');
            done();
        });
    });
});
