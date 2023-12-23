# frozen_string_literal: true

class WorkController < ApplicationController
  def index
    @works = Work.all.map do |work|
      {
        work_id: work.id,
        worker_name: work.worker_name,
        robot_id: work.robot_id,
        completed: work.completed?,
        messages: work.messages.to_json
      }
    end
  end
end
