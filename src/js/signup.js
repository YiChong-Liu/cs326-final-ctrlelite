
$('#registerCheck').click(function() {
	if (!$('#registerCheck').is(':checked')) {
    	$('#submit_button').attr('disabled', 'disabled');
    } else {
    	$('#submit_button').removeAttr('disabled');
    }
});


var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");



function validatePassword(){
  if(password.value != confirm_password.value) {
    alert("Passwords Don't Match! Try again.");
    return false;
  } else {
    return true;
  }
}



document.getElementById('submit_button').addEventListener('click', function(x) {
    if(validatePassword()) {
        let e = document.getElementById('email').value;
        let p = document.getElementById('password').value;
        let n = document.getElementById('username').value;
        signupUser(e, p, n);
    }
});

async function signupUser(e, p, n) {
	let response = await fetch('/api/users/newUser', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'email': e, 'password': p, 'username': n})});
    if(response.ok){
        window.location = response.url;
    } else {
        alert('User with that email exists');
    }
}
