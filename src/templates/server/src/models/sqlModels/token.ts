import { DataTypes } from "sequelize";
import { User } from "./user";
import { sequelize } from "../index";

export const Token = sequelize.define("Token", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now() + 43200,
  },
});
Token.belongsTo(User, { foreignKey: "userId" });
Token.sync();

