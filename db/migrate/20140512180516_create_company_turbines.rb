class CreateCompanyTurbines < ActiveRecord::Migration
  def change
    create_table :company_turbines do |t|
      t.string :turbine_model
      t.references :company

      t.timestamps
    end
    add_index :company_turbines, :company_id
  end
end
