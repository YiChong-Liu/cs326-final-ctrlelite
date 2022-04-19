
$('#registerCheck').click(function() {
	if ($('#submit_button').is(':disabled')) {
    	$('#submit_button').removeAttr('disabled');
    } else {
    	$('#submit_button').attr('disabled', 'disabled');
    }
});


function signupUser(e, p) {
	let response = await fetch('/users/newUser', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'email': e, 'password': p})});
    if(response.ok){
        let responseJSON = await response.json();
        console.log(responseJSON);
    } else {
        console.log('ERROR: failed to update preferences');
    }
}

document.getElementById('submit_button').addEventListener('click', function(x) {
	let e = document.getElementById('registerEmail').value;
	let p = document.getElementById('registerPassword').value;
	signupUser(e, p);
});
