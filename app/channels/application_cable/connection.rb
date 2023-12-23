# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :robot_id

    def connect
      url = env['REQUEST_URI']

      robot_id = url.split('/').last

      self.robot_id = (robot_id.presence || 'dashboard')
    end
  end
end
