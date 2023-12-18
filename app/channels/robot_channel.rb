# frozen_string_literal: true

class RobotChannel < ApplicationCable::Channel
  def subscribed
    if params[:dashboard]
      stream_from 'robot_dashboard'

      Rails.logger.debug 'Dashboard subscribed to RobotChannel'
    elsif id
      stream_from "robot_dashboard_#{params[:computer_id]}"

      Rails.logger.debug "Robot #{id} subscribed to RobotChannel"
    end
  end

  def unsubscribed
    return unless id

    robot = Robot.turn_off(id)

    ActionCable.server.broadcast(
      'robot_dashboard',
      { type: 'unsubscribed', id:, status: robot.status }
    )
  end

  def acknowledgement(data)
    coordinates = data['coordinates']
    id = data['computer_id']

    robot = Robot.turn_on(id,
                          x: coordinates['x'],
                          y: coordinates['y'],
                          z: coordinates['z'],
                          direction: coordinates['direction'])

    ActionCable.server.broadcast(
      'robot_dashboard',
      { type: 'acknowledgement', id:, status: robot.status }
    )

    ActionCable.server.broadcast(
      'robot_dashboard',
      {
        type: 'coordinates_updated',
        id:,
        coordinates: robot.coordinates,
        direction: robot.direction
      }
    )
  end

  def move(data)
    direction = data['direction']
    robot_id = data['id']

    MoveJob.perform_async(robot_id, direction)
  end

  def mine(data)
    robot_id = data['id']

    QueryJob
      .perform_async(
        robot_id,
        ['getFuelLevel'],
        "MineWithFuelLevel",
        "call"
      )
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def action_done(data)
    job_id = data['job_id']
    robot_id = data['computer_id']
    robot = Robot.find(robot_id)

    original_message = data['original_message']

    case original_message['type']
    when 'turtle_action'
      direction = original_message['direction']

      Move.new(robot:, direction:).update_coordinates!

      ActionCable.server.broadcast(
        'robot_dashboard',
        {
          type: 'coordinates_updated',
          id: robot.robot_id,
          coordinates: robot.coordinates,
          direction: robot.direction
        }
      )

    when 'turtle_query'
      response = data['response']
      next_action_id = original_message['next_action_id']

      NextAction.find(next_action_id).complete!(response)

    when 'chained_action'
      next_action_id = original_message['next_action_id']

      NextAction.find(next_action_id).complete!(original_message)
    end

    Work.find_by(job_id:).complete!
    ActionCable.server.broadcast(
      'robot_dashboard',
      { type: 'action_completed', id: robot_id }
    )
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  def disconnect
    Robot.all.find_each(&:turn_off)
  end

  private

  def id
    params['computer_id']
  end
end
