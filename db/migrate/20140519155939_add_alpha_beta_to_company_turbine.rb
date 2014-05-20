class AddAlphaBetaToCompanyTurbine < ActiveRecord::Migration
  def change
    add_column :company_turbines, :alpha, :float
    add_column :company_turbines, :beta, :float
  end
end
