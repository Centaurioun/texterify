class CreateFlavors < ActiveRecord::Migration[6.1]
  def change
    create_table :flavors, id: :uuid do |t|
      t.string :name, null: false
      t.references :project, index: true, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.timestamps
    end

    add_reference :export_configs, :flavor, type: :uuid, foreign_key: { on_delete: :cascade }
    add_reference :translations, :flavor, type: :uuid, foreign_key: { on_delete: :cascade }

    ExportConfig.all.each do |export_config|
      # Create a new flavor for every export config.
      flavor = Flavor.new
      flavor.name = export_config.name
      flavor.project_id = export_config.project_id
      flavor.save!

      # Assign the export config to the new flavor.
      export_config.flavor_id = flavor.id
      export_config.save!

      # Reassign all translations to the flavor.
      export_config.translations.each do |translation|
        translation.flavor_id = flavor.id
        translation.save!
      end
    end

    remove_column :translations, :export_config_id
  end
end
