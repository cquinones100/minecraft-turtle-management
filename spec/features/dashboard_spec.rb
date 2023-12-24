# frozen_string_literal: true

require 'rails_helper'
require 'support/turtle_mock'

RSpec.describe 'Dashboard', type: :feature, js: true do
  describe 'on load' do
    it 'displays an existing robot' do
      robot = Robot.create(robot_id: 1)

      visit '/'

      expect(robot_row(robot.id)).not_to be_nil
      expect(robot_id(robot.id).text).to eq robot.id.to_s
      expect(robot_status(robot.id).text).to eq '🔴'
      expect(robot_coordinates(robot.id).text).to eq ''
      expect(robot_direction(robot.id).text).to eq ''
    end

    it 'displays an existing working status' do
      robot = Robot.create(robot_id: 1)

      Work.create(
        robot:,
        job_id: '123',
        messages: %w[forward],
        worker_name: 'MineJob'
      )

      visit '/'

      expect(mining_button(robot.id)[:disabled]).to eq 'true'
    end
  end

  describe 'on acknowledgement' do
    it 'adds new robots' do
      visit_dashboard

      TurtleMock.new(robot_id: 1).acknowledge

      expect(robot_row(1)).not_to be_nil

      acknowledge(2)
      expect(robot_row(2)).not_to be_nil
    end

    it 'reflects the declared coordinates' do
      visit_dashboard

      TurtleMock
        .new(
          robot_id: 1,
          x: 12,
          y: 2,
          z: 3,
          direction: 'north',
          context: self
        ).acknowledge

      expect(robot_id(1).text).to eq '1'
      expect(robot_status(1).text).to eq '🟢'
      expect(robot_coordinates(1).text).to eq '12, 2, 3'
      expect(robot_direction(1).text).to eq 'north'
    end
  end

  describe 'mining' do
    it 'disables the mine button on click' do
      robot = Robot.create(robot_id: 1)

      visit '/'

      expect(mining_button(robot.id)[:disabled]).to eq 'false'

      mining_button(robot.id).click

      expect(mining_button(robot.id)[:disabled]).to eq 'true'
    end

    it 'enables the mine button when the robot is done mining' do
      robot = Robot.create(robot_id: 1)
      robot.set_coordinates(x: 1, y: 1, z: 1, direction: 'north')

      visit '/'

      TurtleMock.new(
        robot_id: robot.id,
        x: 1,
        y: 1,
        z: 1,
        direction: 'north',
        context: self
      ).acknowledge

      expect(mining_button(robot.id)[:disabled]).to eq 'false'

      mining_button(robot.id).click

      expect(mining_button(robot.id)[:disabled]).to eq 'true'

      expect(mining_button(robot.id)[:disabled]).to be_nil
    end
  end

  def visit_dashboard
    visit '/'

    expect(robot_table).not_to be_nil
  end

  def robot_table
    page.find('table')
  end

  def robot_rows
    page.find_all('tr').select { |tr| tr[:id].start_with?('robot-') }
  end

  def robot_row(id)
    page.find("#robot-#{id}")
  end

  def robot_id(id)
    page.find("#robot-#{id}-id")
  end

  def robot_status(id)
    page.find("#robot-#{id}-status")
  end

  def robot_coordinates(id)
    page.find("#robot-#{id}-coordinates")
  end

  def robot_direction(id)
    page.find("#robot-#{id}-direction")
  end

  def mining_button(id)
    page.find("#robot-#{id}-Mine-button")
  end
end
