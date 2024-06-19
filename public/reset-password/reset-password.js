// lock navbar
$(document).scroll(function () {
    if ($(this).scrollTop() > 550) {
        $('header').addClass('scrolled');
    } else {
        $('header').removeClass('scrolled');
    }
});

//login and signup font effects
const inputs = document.querySelectorAll(".input");

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}


inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

// reset-password.js
function getResetTokenFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
}
$(document).ready(function () {
    $("#resetPassword").submit(function (e) {
        e.preventDefault();

        // Get values from the form
        const password = $("#password").val();
        const confirmPassword = $("#confirmpassword").val();
        const token = getResetTokenFromURL()
        // Validation: Check if passwords match
        if (password !== confirmPassword) {
            toastr.error("Passwords do not match");
            return;
        }

        // Additional validation logic if needed

        // Send a request to your server to reset the password
        $.ajax({
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            url: "/api/user/change-password", // Replace with your API endpoint
            data: JSON.stringify( {
                newPassword: password,
                forgot: true
                // Add any additional data needed for reset password API
            }),
            headers: {
                'authorization': token,
            },
            success: function (response) {
                toastr.success(response.message);
                setInterval(()=>{
                    window.location.href = '/';

                },5000)
                // Redirect or perform additional actions on success
            },
            error: function (error) {
                console.error("Error resetting password:", error.responseText);
                toastr.error("Error resetting password");
            },
        });
    });
});
