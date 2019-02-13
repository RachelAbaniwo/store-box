class SessionsController < ApplicationController
  def store
    if ENV['SECURE_PASSWORD'] == params[:password]
      session[:logged_in] = true
    else
      flash[:error] = 'Password mismatch.'
    end
    
    redirect_to '/'
  end
end
