class TurbineDetail < ActiveRecord::Base
  belongs_to :company_turbine
  attr_accessible :power_output, :wind_speed
end
