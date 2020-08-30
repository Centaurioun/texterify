class ExportConfigSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :file_format, :file_path, :default_language_file_path

  has_many :language_configs
end
