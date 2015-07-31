require_relative '../lib/midara.rb'

desc 'Generate extra data'
task :generate do
  puts "# Starting to generate extra data"
  Midara::User.new.run
end
