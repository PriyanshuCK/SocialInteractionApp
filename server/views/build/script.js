const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");
const status = urlParams.get("status");
const type = urlParams.get("type");
const id = urlParams.get("id");

if (type === "reset") {

    const statusCard = document.getElementById("statusCard");
    const formCard = document.getElementById("formCard");

    statusCard.classList.remove("showCard");
    statusCard.classList.add("hideCard");

    formCard.classList.remove("hideCard");
    formCard.classList.add("showCard");

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("userId").value = id;
        const el = document.getElementById('submitResetForm');
        if (el) {
            el.addEventListener("click", validateForm);
        }
    });

    function validateForm(e) {
        var newPassword = document.getElementById("newPassword").value;
        var confirmPassword = document.getElementById("confirmPassword").value;
        var format = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (newPassword == "") {
            document.getElementById("message1").innerHTML = "New Password is required!";
            e.preventDefault();
            return false;
        }

        if (confirmPassword == "") {
            document.getElementById("message2").innerHTML = "Confirm Password is required!";
            e.preventDefault();
            return false;
        }

        if (newPassword.length < 8) {
            document.getElementById("message1").innerHTML = "Password length must be atleast 8 characters";
            e.preventDefault();
            return false;
        }

        if (newPassword.length > 15) {
            document.getElementById("message1").innerHTML = "Password length must not exceed 15 characters";
            e.preventDefault();
            return false;
        }

        if (!newPassword.match(format)) {
            document.getElementById("message1").innerHTML = "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
            e.preventDefault();
            return false;
        }

        if (newPassword !== confirmPassword) {
            document.getElementById("message2").innerHTML = "Passwords do not match. Please try again!";
            e.preventDefault();
            return false;
        }
        document.getElementById("resetForm").method = "POST";
        document.getElementById("resetForm").action = "/users/reset-password";
        return true;
    }
}


else {
    const card = document.querySelector('.card');
    const statusIcon = document.getElementById('statusIcon');
    const statusMessage = document.getElementById('statusMessage');
    const btn = document.getElementById('btn');

    if (status === "success") {
        statusIcon.innerHTML = '✅';
        statusMessage.textContent = message;
        card.classList.add('success');
        statusIcon.classList.add('success');
        statusMessage.classList.add('success');
        btn.classList.add("showBtn");
    }
    else if (status === 'error') {
        statusIcon.innerHTML = '❌';
        statusMessage.textContent = message;
        card.classList.add('error');
        statusIcon.classList.add('error');
        statusMessage.classList.add('error');
        btn.classList.add("hideBtn");
    }
    else {
        statusIcon.innerHTML = '❓';
        statusMessage.textContent = message;
        card.classList.add('error');
        statusIcon.classList.add('error');
        statusMessage.classList.add('error');
        btn.classList.add("hideBtn");
    }
}

