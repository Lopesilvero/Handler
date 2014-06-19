# Pull in some gems for functionality
require 'sinatra/base'
# require 'sinatra/activerecord'
require 'omniauth-twitter'
require 'twitter'

# Define our modular Sinatra app
class Handler < Sinatra::Base
  # register Sinatra::ActiveRecordExtension

  # Configure our app
  # Enable sessions and set up omniauth-twitter with our keys
  configure do
    enable :sessions

    use OmniAuth::Builder do
      provider :twitter, ENV['TWITTER_CONSUMER_KEY'], ENV['TWITTER_CONSUMER_SECRET']
    end
  end

  # Index action
  # GET /
  #
  # Allows authenticated users to use H@ndler
  get '/' do
    redirect to('/unauthenticated') unless session[:access_token]

    @name = session[:name]
    erb :index
  end

  # Index action
  # GET /unauthenticated
  #
  # Prompts users to sign in with Twitter
  get '/unauthenticated' do
    erb :unauthenticated
  end

  # Post Tweet action
  # POST /post-tweet
  #
  # Allows authenticated users to send tweets from their account.
  #
  # We use twitter to authenticate with Twitter's REST API
  # using our consumer keys and the user's access keys
  #
  # Params:
  #   - tweet - string - text of tweet to send
  post '/post-tweet' do
    redirect to('/unauthenticated') unless session[:access_token]

    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
      config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
      config.access_token        = session[:access_token]
      config.access_token_secret = session[:access_secret]
    end

    client.update(params[:tweet]) if params[:tweet]
    redirect to('/')
  end
   
  # Login action
  # GET /login
  #
  # Allows authenticated users to use H@ndler
  get '/login' do
    redirect to('/auth/twitter')
  end
   
  # Logout action
  # GET /logout
  #
  # Deletes session data to logout a user
  get '/logout' do
    session[:name] = nil
    session[:access_token] = nil
    session[:access_secret] = nil

    redirect to('/')
  end

  # Twitter Auth Callback action
  # GET /auth/twitter/callback
  #
  # Receives authentication info from Twitter after user signs in 
  get '/auth/twitter/callback' do
    halt(401,'Not Authorized') unless env['omniauth.auth']

    session[:name] = env['omniauth.auth'][:info][:name]
    session[:access_token] = env['omniauth.auth'][:credentials][:token]
    session[:access_secret] = env['omniauth.auth'][:credentials][:secret]

    redirect to('/')
  end

  # Auth Failure action
  # GET /auth/failure
  #
  # Displays reason for an authentication failure
  get '/auth/failure' do
    params[:message]
  end
end