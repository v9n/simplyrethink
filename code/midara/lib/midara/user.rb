require 'faker'

module Midara

  class User < Generator::Base
    include Midara::Random

    def table
      return :users
    end

    def generate(howmany: 5)
      docs = []
      howmany.times do |i|
        puts Faker::Name.name
        docs << {
          name: Faker::Name.name,
          favfoods: food(limit: 5).map { |d| d["name"] }
        }
      end
      return docs
    end
  end
end

puts "sa"
