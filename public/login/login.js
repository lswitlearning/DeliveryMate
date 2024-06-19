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
                alert("Logged in Succesfully")
                window.location.replace("http://localhost:3000/home/");
            }
        }
    });
}

// Take over form submission
form.addEventListener("submit", (event) => {

    event.preventDefault();
    sendData();
});
