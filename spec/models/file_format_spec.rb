require 'rails_helper'

RSpec.describe FileFormat, type: :model do
  it 'creates a file format' do
    project = create(:project, :with_organization)
    project.save!

    file_format = FileFormat.new
    file_format.format = 'My file format'
    file_format.save!
  end
end