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
				//console.log(data);
				var d1 = [];
				for (var i = 0; i < data.length; i++) {
					d1.push([data[i].wind_speed, data[i].power_output]);
				}

				$.plot("#placeholder", [{
					data : d1,
					color:'lightblue',
					lines : {
						show : true,
						fill : true
					}
				}]);

					/*
					 $("#turbine_details").html("<b>Turbine Details</b><br />");
					 $("#turbine_details").append("Rated power: _ MW \
					 , Cut-in velocity: _ m/s \
					 , Cut-out velocity: _ m/s \
					 , Rated Velocity: _ m/s");
					 $("#turbine_details").append("<br/>Alpha: _ <br/>Beta: _");
					 */

				$("#turbine_form").html("<form id='form_kc' method='POST' action='/run'> \
					<table> \
					<tr><td>K </td><td><input type='text' id='input_k' value='2.08' /> </td></tr> \
					<tr><td>C </td><td><input type='text' id='input_c' value='3.44' /> </td></tr> \
					<tr><td>Hub height </td><td><input type='text' id='hub_height' value='80' /> \
					<td><input type='button' id='submit_kc'  value='Run' /></td></tr>	\
					</table> \
					</form>");
					
		
				$("#submit_kc").click(function() {
					console.log('clicked');
					//$("#form_kc").submit();

						url = "/run";
				
					$.ajax({
						type : 'POST',
						url : url,
						async : false,
						data : {
							k : $('#input_k').val(),
							c : $('#input_c').val(),
							hub_height : $('#hub_height').val(),
							turbine_id: $('#turbines_dropdown').val()
						},
						dataType : "json",
						success : function(data) {

							console.log(data);
							var d1 = [];
							
							for (var i = 0; i < data.v_arr.length; i++) {
								d1.push([data.v_arr[i], data.p_arr[i]]);
							}

							$.plot("#placeholder_empirical", [{
								data : d1,
								color:'red',
								lines : {
									show : true,
									fill : true
								}
							}]);
							
							//update capacity div
							$("#capacity").html("<b>Capacity = </b>"+ data.capacity);
							
						}
					});

				});

			}
		});
	});


});
