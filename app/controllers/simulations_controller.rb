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

end
