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

document.addEventListener('DOMContentLoaded', () => {
    const forgetPasswordForm = document.getElementById('forgetPassword');

    forgetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;

        // Validate email (you may add more validation)
        if (!email) {
            toastr.error('Please enter your email');
            return;
        }

        try {
            const response = await fetch('/api/user/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                // Password reset link sent successfully
                toastr.success(data.message);
                $("#forgetPassword").trigger("reset");
            } else {
                // Error message from the server
                toastr.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toastr.error('An error occurred. Please try again later.');
        }
    });
});
