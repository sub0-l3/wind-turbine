$(function() {
	//select company from dropdown should populate turbine dropdown

	$('#company_name').on('change', function() {
		//console.log(this.value);
		// or $(this).val()

		url = "/get_turbine_details";
		$.ajax({
			type : 'GET',
			url : url,
			async : false,
			data : {
				company_id : this.value
			},
			dataType : "json",
			success : function(data) {
				//console.log(data);
				//$('#turbines_dropdown').html("<option value='" + data[0].id + "'>" + data[0].turbine_model + "</option>");
				$('#turbines_dropdown').html("<option value=''></option>");
				
				for (var i = 0; i < data.length; i++) {
					$('#turbines_dropdown').append("<option value='" + data[i].id + "'>" + data[i].turbine_model + "</option>");
				}

			}
		});

	});
	//select turbine from dropdown should plot graph
	$('#turbines_dropdown').on('change', function() {
		url = "/get_turbine_graph_data";
		$.ajax({
			type : 'GET',
			url : url,
			async : false,
			data : {
				turbine_id : this.value
			},
			dataType : "json",
			success : function(data) {
				console.log(data);
				var d1 = [];
				for (var i = 0; i < data.length; i++) {
					d1.push([data[i].wind_speed, data[i].power_output]);
				}
				$.plot("#placeholder", [{
					data : d1,
					lines : {
						show : true,
						fill : true
					}
				}]);
			}
		});
	});

});
