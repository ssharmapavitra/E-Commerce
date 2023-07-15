const names = document.getElementById("name");
const username = document.getElementById("username");
const password = document.getElementById("password");
const mobile = document.getElementById("mobile");
const form = document.querySelector("form");
const error = document.getElementById("error");

//Check details before submitting
form.addEventListener("submit", (e) => {
	//Check for empty fields
	if (
		!names.value.trim() ||
		!username.value.trim() ||
		!password.value.trim() ||
		!mobile.value.trim()
	) {
		error.innerHTML = "Please fill all the details";
		e.preventDefault();
		return;
	}

	//Check for email
	else if (!username.value.includes("@")) {
		error.innerHTML = "Please enter a valid email";
		e.preventDefault();
		return;
	} else if (!checkPassword(password.value)) {
		const error = document.getElementById("error");
		error.innerHTML = "Password does not meet the requirements";
		e.preventDefault();
		return;
	}
	//Check for mobile number (on;y contains numbers and size is 10)
	else if (isNaN(mobile.value) || mobile.value.length != 10) {
		error.innerHTML = "Please enter a valid mobile number";
		e.preventDefault();
		return;
	}
});

// console.log(checkPassword("P"));

//Check password function
function checkPassword(str) {
	var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
	return re.test(str);
}
