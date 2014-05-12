class CreateTurbineDetails < ActiveRecord::Migration
  def change
    create_table :turbine_details do |t|
      t.float :wind_speed
      t.float :power_output
      t.references :company_turbine

      t.timestamps
    end
    add_index :turbine_details, :company_turbine_id
  end
end
