const username = document.getElementById("username");
const password = document.getElementById("password");

//Check if password is in correct format before submitting
form.addEventListener("submit", (e) => {
	if (checkPassword(password.value)) {
		const error = document.getElementById("error");
		error.innerHTML = "Password does not meet the requirements";
		e.preventDefault();
	}
});

//Check password function
function checkPassword(str) {
	var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
	return re.test(str);
}
