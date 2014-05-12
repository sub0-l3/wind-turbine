class CompanyTurbine < ActiveRecord::Base
  belongs_to :company
  attr_accessible :turbine_model
end
