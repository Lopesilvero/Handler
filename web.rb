require 'sinatra/base'
# require 'sinatra/activerecord'
require 'omniauth-twitter'
require 'twitter'

class Handler < Sinatra::Base
  # register Sinatra::ActiveRecordExtension
  # set :database, {adapter: 'postgresql', database: ENV['DATABASE_URL']}

  configure do
    enable :sessions

    use OmniAuth::Builder do
      provider :twitter, ENV['TWITTER_CONSUMER_KEY'], ENV['TWITTER_CONSUMER_SECRET']
    end
  end

  get '/' do
    redirect to('/auth/twitter') unless session[:access_token]
    @name = session[:name]
    erb :index
  end

  get '/post-tweet' do
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
      config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
      config.access_token        = session[:access_token]
      config.access_token_secret = session[:access_secret]
    end
    client.update("test from handler /cc @Lopesilvero")
    redirect to('/')
  end
   
  get '/login' do
    redirect to('/auth/twitter')
  end
   
  get '/logout' do
    redirect to('/')
  end

  get '/auth/twitter/callback' do
    halt(401,'Not Authorized') unless env['omniauth.auth']
    # session[:omniauth] = env['omniauth.auth']
    session[:name] = env['omniauth.auth'][:info][:name]
    session[:access_token] = env['omniauth.auth'][:credentials][:token]
    session[:access_secret] = env['omniauth.auth'][:credentials][:secret]

    redirect to('/')
  end

  get '/auth/failure' do
    params[:message]
  end
end