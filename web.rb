require 'sinatra'
require 'sinatra/sequel'

get '/' do
  erb :index
end