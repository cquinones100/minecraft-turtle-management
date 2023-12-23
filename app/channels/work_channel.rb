class WorkChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'work_dashboard'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
