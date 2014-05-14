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
    @graph_data = TurbineDetail.find_all_by_company_turbine_id(params[:turbine_id])
    
    respond_to do |format|
      format.html
      format.json { render json: @graph_data }
    end

  end

end
