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

const form = document.querySelector("#logininfo");

async function sendData() {
    let data = {
        "username": $("#username").val(),
        "password": $("#password").val()
    }
    $.ajax({
        url: '/api/user/login',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: (result) => {
            if (result.statusCode === 200) {
                $("#logininfo").trigger("reset");
                // alert("Logged in Succesfully")
                toastr.success("Logged in Successfully");
                console.log(result)
                localStorage.setItem('token',result.data.token)
                window.location.replace("http://localhost:3000/home/");
            }
        },
        error: (error) => {
            console.error("Error in AJAX request:", error);
            toastr.error(error.responseJSON['error']['message']);
        }
    });
}

// Take over form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();
});

















