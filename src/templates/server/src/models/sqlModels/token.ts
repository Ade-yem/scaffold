import { DataTypes } from "sequelize";
import { User } from "./user";
import { sequelize } from "../index";

const newDate = new Date();
newDate.setTime(Date.now() + 43200);

export const Token = sequelize.define("Token", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: newDate,
  },
});
Token.belongsTo(User, { foreignKey: "userId" });
Token.sync();

