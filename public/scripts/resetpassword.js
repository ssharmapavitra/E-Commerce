const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");
const form = document.querySelector("form");

//Check if passwords match before submitting
form.addEventListener("submit", (e) => {
	if (password1.value !== password2.value) {
		const error = document.getElementById("error");
		error.innerHTML = "Passwords do not match";
		e.preventDefault();
	} else if (checkPassword(password1.value)) {
		const error = document.getElementById("error");
		error.innerHTML = "Password does not meet the requirements";
		e.preventDefault();
	}
});

//Check password function
function checkPassword(str) {
	var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
	return re.test(str);

	//Sample password for testing
	//Password@123
}
