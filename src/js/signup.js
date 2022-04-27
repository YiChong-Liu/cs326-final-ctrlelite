
$('#registerCheck').click(function() {
	if (!$('#registerCheck').is(':checked')) {
    	$('#submit_button').attr('disabled', 'disabled');
    } else {
    	$('#submit_button').removeAttr('disabled');
    }
});



async function signupUser(e, p) {
	let response = await fetch('/api/users/newUser', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'email': e, 'password': p})});
    if(response.ok){
        window.location = response.url; 
    } else {
        alert('User with that email exists');
    }
}

document.getElementById('submit_button').addEventListener('click', function(x) {
	let e = document.getElementById('email').value;
	let p = document.getElementById('password').value;
	signupUser(e, p);
});
