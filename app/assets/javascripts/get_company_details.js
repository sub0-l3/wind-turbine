$(function() {
	$('select').on('change', function() {
		console.log(this.value);
		// or $(this).val()

		//adding district layer
		url = "/get_turbine_details";
		$.ajax({
			type : 'GET',
			url : url,
			async : false,
			data : { 
				company_id: this.value
			},
			dataType : "json",
			success : function(data) {
			}
		});

	});
});
