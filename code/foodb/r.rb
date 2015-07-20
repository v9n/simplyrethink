require 'mysql2'
require 'sequel'
require 'pry'
require 'rethinkdb'

class Importer
  include RethinkDB::Shortcuts

  def initialize
    @client = Sequel.connect(
      :adapter => 'mysql2',
      :host => '127.0.0.1',
      :user => 'root',
      :password => 'root',
      :database => 'food',
      :wait_timeout => 30,
      :timeout => 30,
    )

    @connection = r.connect
    begin
      r.db_create("foodb").run @connection
    rescue 
    end
  end

  def run
    @tables = %w{compound_synonyms compounds compounds_flavors compounds_foods compounds_health_effects flavors foods health_effects}

    @tables.map{ |t| Thread.new {migrate(t)} }.each(&:join)
  end

  def migrate(t)
    p "Going to migrate table #{t}"
    r.db("foodb").table_create(t).run @connection rescue nil

    count = 1
    while true do
      begin
        q = "SELECT * FROM #{t} ORDER BY id ASC LIMIT #{count}, 20"
        result = @client[q]
        p q
        break if result.count == 0

        result.each do |row|
          p "#{t}/#{count}"
          r.db("foodb").table(t).insert(row).run @connection
          count = row[:id]
        end
      rescue Exception => e
        p "Get error on #{t} at record #{count}: #{e}"
      end
    end

  end

end

Importer.new.run
