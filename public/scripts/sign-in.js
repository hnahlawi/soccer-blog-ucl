

const signUpButton = document.getElementById('signUpButton')
const signInButton = document.getElementById('signInButton')


signUpButton.addEventListener('click', signUp)

signInButton.addEventListener('click', signIn)



function signIn(){

	const usernameText = document.getElementById('InputEmail1').value
	const passwordText = document.getElementById('InputPassword1').value


	const credentials = {
		username: usernameText,
		password: passwordText
	}

	const loginreq = new Request('/login', {
	        method: 'post',
	        body: JSON.stringify(credentials),
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });

	fetch(loginreq).then((result)=>{
		return result.json()
	}).then((response)=>{


		if(response.status == "200"){
			console.log('success')
			window.location.replace(window.location.protocol + "//" + window.location.host + response.message)
		}
		else if(response.message == 'error'){
			const errorMsg = document.getElementById('errorMsg')
			errorMsg.innerHTML = "Server error. Please try again."
			errorMsg.style.display="block"

			setInterval(function(){ errorMsg.style.display = "none" }, 5000);


		}
		else{
			const errorMsg = document.getElementById('errorMsg')
			errorMsg.innerHTML = "Wrong credentials"

			errorMsg.style.display="block"

			setInterval(function(){ errorMsg.style.display = "none" }, 5000);

		}
	})

}


function signUp(){
	const usernameText = document.getElementById('InputEmail2').value
	const passwordText = document.getElementById('InputPassword2').value
	const confirmText = document.getElementById('InputPassword3').value
	const errorMsg2 = document.getElementById('errorMsg2')


	if (usernameText.indexOf(" ") != -1){

		errorMsg2.innerHTML = "User name cannot contain spaces"
		errorMsg2.style.display="block"
		setInterval(function(){ errorMsg.style.display = "none" }, 5000);
		return null

	}
	else if(passwordText != confirmText){
		errorMsg2.innerHTML = "Password fields do not match"
		errorMsg2.style.display="block"
		setInterval(function(){ errorMsg.style.display = "none" }, 5000);
		return null

	}



	const credentials = {
		username: usernameText,
		password: passwordText
	}

	const signupreq = new Request('/signup', {
	        method: 'post',
	        body: JSON.stringify(credentials),
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });

	fetch(signupreq).then((result)=>{
		return result.json()
	}).then((response)=>{


		if(response.status == "200"){
			console.log('success')
			window.location.replace(window.location.protocol + "//" + window.location.host + response.message)
		}
		else if(response.message == 'exists'){
			const errorMsg = document.getElementById('errorMsg2')
			errorMsg2.innerHTML = "User name is taken"
			errorMsg2.style.display="block"

			setInterval(function(){ errorMsg2.style.display = "none" }, 5000);

		}
		else if(response.message == 'short'){
			const errorMsg = document.getElementById('errorMsg2')
			errorMsg2.innerHTML = "Password should be at least 8 characters"
			errorMsg2.style.display="block"

			setInterval(function(){ errorMsg2.style.display = "none" }, 5000);

		}
	})


}