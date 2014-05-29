class SimulationsController < ApplicationController
  def get_company_details
    @company = Company.all
  end

  def get_turbine_details
    p params[:company_id]
    @company_turbines = CompanyTurbine.find_all_by_company_id(params[:company_id])

    respond_to do |format|
      format.html
      format.json { render json: @company_turbines }
    end

  end

  def get_turbine_graph_data
    p params[:turbine_id]
    @graph_data = TurbineDetail.order(:wind_speed).find_all_by_company_turbine_id(params[:turbine_id])

    #repeated code - starts
    turbine_record = TurbineDetail.where("company_turbine_id = #{params[:turbine_id]}")
    v_i = turbine_record.where('power_output = 0').maximum(:wind_speed)
    #v_i = 3.0 #cut-in velocity
    p_r = turbine_record.maximum(:power_output)
    r = turbine_record.order("wind_speed ASC").where('power_output = ?',p_r)
    v_r = r.first.wind_speed
    #p_r = 1.0 #rated power corresponding to rated velocity
    #v_r = 12.0 #rated velocity

    r = turbine_record.order("wind_speed DESC").first
    v_o = r.wind_speed
    #v_o = 22.0 #cut-out velocity
    t = CompanyTurbine.find("#{params[:turbine_id]}")
    t.update_attributes(cutin_velocity: v_i, rated_power: p_r, rated_velocity: v_r, cutout_velocity: v_o)
    #turbine_record.save
    alpha = t.alpha#1.4
    beta = t.beta#1.7
    #repeated code - ends

    respond_to do |format|
      format.html
      format.json { render json:{graph_data: @graph_data, alpha: alpha, beta: beta, v_i: v_i, p_r: p_r, v_r: v_r, v_o: v_o} }
    end

  end

  def run
    #p params[:all]
    turbine_record = TurbineDetail.where("company_turbine_id = #{params[:turbine_id]}")
    v_i = turbine_record.where('power_output = 0').maximum(:wind_speed)
    #v_i = 3.0 #cut-in velocity
    p_r = turbine_record.maximum(:power_output)
    r = turbine_record.order("wind_speed ASC").where('power_output = ?',p_r)
    v_r = r.first.wind_speed
    #p_r = 1.0 #rated power corresponding to rated velocity
    #v_r = 12.0 #rated velocity

    r = turbine_record.order("wind_speed DESC").first
    v_o = r.wind_speed
    #v_o = 22.0 #cut-out velocity
    t = CompanyTurbine.find("#{params[:turbine_id]}")
    t.update_attributes(cutin_velocity: v_i, rated_power: p_r, rated_velocity: v_r, cutout_velocity: v_o)
    #turbine_record.save
    alpha = 1.4
    beta = 1.7

    v = v_i/v_r
    i = v #initialize
    @v_arr = []
    @p_arr = []

    while i < 1
      p =  1-(((1-i)/(1-v))**alpha)*(Math.exp(beta*(i-v)))
      i+=0.01
      #p p*p_r
      @v_arr.push(i*v_r)
      @p_arr.push((p*p_r))
    end

    ##capacity code

    k_input = params[:k].to_f#2.08
    c_input = params[:c].to_f#3.44
    hub_height = params[:hub_height].to_f#80

    n = (0.37 - 0.088*Math.log(c_input))/(1-0.088*Math.log(8))
    c = c_input*(hub_height/80)**n
    val = Math.exp(-1*(v_i/c)**k_input) - Math.exp(-1*(v_o/c)**k_input)
    sum = 0
    i = v #initialize
    while i < 1
      part_1 = ((1-i)**alpha)*((i/c)**(k_input-1))
      part_2 = Math.exp((beta*(i-v))-((v_r**k_input)*((i/c)**k_input)))

      sum = sum + (part_1*part_2*0.01)
      i+=0.01
    end
    j =  ((v_r**(k_input-1))/(1-v)**alpha)*(k_input/c)*sum
    @capacity = (val -j)
    @capacity = @capacity.round(2)
    
    respond_to do |format|
      format.json { render json: {v_arr: @v_arr, p_arr: @p_arr, capacity:@capacity}  }
    end
  end

end
