async function signupUser(e, p) {
	let response = await fetch('/api/login/passwd', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'email': e, 'password': p})});
    if(response.ok){
        window.location = response.url; 
    } else {
        alert('Invalid username or password')
    }
}

document.getElementById('submit_button').addEventListener('click', function(x) {
	let e = document.getElementById('email').value;
	let p = document.getElementById('password').value;
	signupUser(e, p);
});
