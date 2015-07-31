require 'rethinkdb'

module Midara
  module Generator
    class Base

      def run(howmany: 50)
        record = generate(howmany: howmany)
        Midara::Writer.new.write(table, record)
      end

      def table
        self.class.to_s.split("::").last.downcase
      end
      def generate
        raise "Please implement this method"
      end
    end
  end

  class Writer
    include RethinkDB::Shortcuts
    def initialize
      @connection = r.connect(db: 'foodb')
    end

    def write(table, document)
      r.table_create(table).run(@connection) rescue nil
      r.table(table).insert(document).run @connection
    end
  end

  def foodname

  end

  require 'pry'
  module Random
    # Return a random foodname
    include RethinkDB::Shortcuts

    def food(limit: 3)
      # Count how many item
      connection = r.connect(db: 'foodb')
      total = r.table('foods').count.run(connection)
      r.table('foods').skip(::Random.new.rand(total-1)+1).limit(limit).run(connection).to_a
    end
  end
end

require_relative 'midara/user.rb'
