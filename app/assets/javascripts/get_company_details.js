var actual_d1=[];

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}


$(function() {
	
	//leaflet code starts here.
			var map = L.map('map').setView([12.9667, 77.5667], 13);
	
	MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>';

	MB_URL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
	L.tileLayer(MB_URL, {attribution: MB_ATTR, id: 'examples.map-20v6611k'}).addTo(map);
		/*
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		*/


		var LeafIcon = L.Icon.extend({
			options: {
				//shadowUrl: '/assets/leaf-shadow.png',
				//iconSize:     [38, 95],
				iconSize:     [55, 55],
				//shadowSize:   [30, 34],
				//iconAnchor:   [22, 55],
				//shadowAnchor: [4, 30],
				popupAnchor:  [-3, -76]
			}
		});

		var greenIcon = new LeafIcon({iconUrl: '/assets/wind-mill-icon.png'});

		marker = new L.marker([12.9667, 77.5667], {icon: greenIcon,draggable : true}).bindPopup("Drag me to Hell..").addTo(map);
        
            marker.on('dragend', function(event){
            var marker = event.target;
            var position = marker.getLatLng();
            console.log(position);
            $('#input_k').val(getRandomArbitrary(1.85,3.4));
             $('#input_c').val(getRandomArbitrary(3.45,8.22));
    		});
	//leaflet code ends here.
	
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
				for (var i = 0; i < data["graph_data"].length; i++) {
					d1.push([data["graph_data"][i].wind_speed, data["graph_data"][i].power_output]);
				}
				actual_d1 = d1;
				$.plot("#placeholder", [{
					data : d1,
					color:'lightblue',
					lines : {
						show : true,
						fill : true
					}
				}]);

					
					 $("#turbine_details").html("<b>Turbine Details</b><br />");
					 $("#turbine_details").append("Rated power: "+ data["p_r"] +"  MW \
					 <br /> Cut-in velocity: "+ data["v_i"] +"  m/s \
					 <br /> Cut-out velocity: "+ data["v_o"] +"  m/s \
					 <br /> Rated Velocity: "+ data["v_r"] +" m/s");
					 $("#turbine_details").append("<br/>Alpha: "+ data["alpha"] +" <br/>Beta: "+ data["beta"] +" ");
					 

				$("#turbine_form").html("<form id='form_kc' method='POST' action='/run'> \
					<table> \
					<tr><td>K </td><td><input type='text' class='text_box_input' id='input_k' value='2.08' /> </td></tr> \
					<tr><td>C </td><td><input type='text' class='text_box_input' id='input_c' value='3.44' /> </td></tr> \
					<tr><td>Hub height </td><td><input type='text' class='text_box_input' id='hub_height' value='80' /> \
					<td></tr><tr><td></td><td><input type='button' id='submit_kc'  value='Run Simulation' /></td></tr>	\
					</table> \
					</form>");
					
		
				$("#submit_kc").click(function() {
					//console.log('clicked');
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

							//console.log(data);
							var d1 = [];
							
							for (var i = 0; i < data.v_arr.length; i++) {
								d1.push([data.v_arr[i], data.p_arr[i]]);
							}
							//console.log(actual_d1.length+"__"+d1.length);
							//$.plot("#placeholder_empirical", [{
							$.plot("#placeholder", [{
								data : actual_d1,
								label:"Actual",
								color:'blue',
								lines : {
									show : true,
									fill : true
								}
							},{
								data : d1,
								label:"Empirical",
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
