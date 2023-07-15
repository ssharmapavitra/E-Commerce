const username = document.getElementById("username");
const password = document.getElementById("password");
const form = document.querySelector("form");
const error = document.getElementById("error");

//Check details before submitting
form.addEventListener("submit", (e) => {
	//Check for empty fields
	if (!username.value.trim() || !password.value.trim()) {
		error.innerHTML = "Please fill all the details";
		e.preventDefault();
		return;
	}

	//Check for email
	else if (!username.value.includes("@")) {
		error.innerHTML = "Please enter a valid email";
		e.preventDefault();
		return;
	}
});
