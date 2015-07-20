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
      :database => 'food'
    )

    r.connect.repl
    begin
      r.db_create("foodb").run
    rescue 
    end
  end

  def run
    @tables = %w{compound_synonyms compounds compounds_flavors compounds_foods compounds_health_effects flavors foods health_effects}

    @tables.map{ |t| Thread.new {migrate(t)} }.each(&:join)
  end

  def migrate(t)
    p "Going to migrate table #{t}"
    r.db("foodb").table_create(t).run rescue nil

    count = 0
    @client["SELECT * FROM #{t}"].each do |row|
      p "#{t}/#{count}"
      count += 1 
      r.db("foodb").table(t).insert(row).run
    end
  end

end

Importer.new.run
