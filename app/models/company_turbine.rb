class CompanyTurbine < ActiveRecord::Base
  belongs_to :company
  attr_accessible :turbine_model,:alpha,:beta,:company_id,:cutin_velocity,:rated_power,:rated_velocity, :cutout_velocity

end
