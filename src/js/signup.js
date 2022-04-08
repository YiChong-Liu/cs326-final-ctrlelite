$('#registerCheck').click(function() {
	if ($('#submit_button').is(':disabled')) {
    	$('#submit_button').removeAttr('disabled');
    } else {
    	$('#submit_button').attr('disabled', 'disabled');
    }
});
