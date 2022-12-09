"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Ticket.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      ticket_pass: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      is_calling: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      modelName: "tickets",
    }
  );
  return Ticket;
};
