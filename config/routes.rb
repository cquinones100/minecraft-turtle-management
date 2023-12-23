# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  mount ActionCable.server => '/cable'

  # Defines the root path route ("/")
  # root "application#index"

  root 'dashboard#index'

  get 'work' => 'work#index'

  mount Sidekiq::Web => '/sidekiq'
end

