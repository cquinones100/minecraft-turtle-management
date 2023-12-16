# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2023_12_16_170305) do
  create_table "robot_coordinates", force: :cascade do |t|
    t.integer "robot_id", null: false
    t.integer "x", null: false
    t.integer "y", null: false
    t.integer "z", null: false
    t.integer "direction", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["robot_id"], name: "index_robot_coordinates_on_robot_id"
    t.index ["x"], name: "index_robot_coordinates_on_x"
    t.index ["y"], name: "index_robot_coordinates_on_y"
    t.index ["z"], name: "index_robot_coordinates_on_z"
  end

  create_table "robot_mias", force: :cascade do |t|
    t.integer "robot_id", null: false
    t.boolean "active", default: true, null: false
    t.index ["robot_id"], name: "index_robot_mias_on_robot_id"
  end

  create_table "robot_statuses", force: :cascade do |t|
    t.integer "robot_id", null: false
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["robot_id"], name: "index_robot_statuses_on_robot_id"
  end

  create_table "robots", primary_key: "robot_id", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["robot_id"], name: "index_robots_on_robot_id", unique: true
  end

end
