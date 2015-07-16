require 'rubygems'
require 'sinatra'
require 'json'

post "/upload" do
  jj params
  params.to_json
end
