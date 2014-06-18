require 'sinatra/base'
# require 'sinatra/activerecord'
require 'omniauth-twitter'
require 'twitter'

class Handler < Sinatra::Base
  # register Sinatra::ActiveRecordExtension

  configure do
    enable :sessions

    use OmniAuth::Builder do
      provider :twitter, ENV['TWITTER_CONSUMER_KEY'], ENV['TWITTER_CONSUMER_SECRET']
    end
  end

  get '/' do
    redirect to('/unauthenticated') unless session[:access_token]

    @name = session[:name]
    erb :index
  end

  get '/unauthenticated' do
    erb :unauthenticated
  end

  post '/post-tweet' do
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
      config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
      config.access_token        = session[:access_token]
      config.access_token_secret = session[:access_secret]
    end

    client.update(params[:tweet]) if params[:tweet]
    redirect to('/')
  end
   
  get '/login' do
    redirect to('/auth/twitter')
  end
   
  get '/logout' do
    session[:name] = nil
    session[:access_token] = nil
    session[:access_secret] = nil

    redirect to('/')
  end

  get '/auth/twitter/callback' do
    halt(401,'Not Authorized') unless env['omniauth.auth']

    session[:name] = env['omniauth.auth'][:info][:name]
    session[:access_token] = env['omniauth.auth'][:credentials][:token]
    session[:access_secret] = env['omniauth.auth'][:credentials][:secret]

    redirect to('/')
  end

  get '/auth/failure' do
    params[:message]
  end
end