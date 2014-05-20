class Add4FieldsToCompanyTurbine < ActiveRecord::Migration
  def change
        add_column :company_turbines, :cutin_velocity, :float
        add_column :company_turbines, :rated_power, :float
        add_column :company_turbines, :rated_velocity, :float
        add_column :company_turbines, :cutout_velocity, :float
  end
end
