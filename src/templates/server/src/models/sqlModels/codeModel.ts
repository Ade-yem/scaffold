import { DataTypes } from "sequelize";
import { sequelize } from "..";
import { User } from "./user";

export const Code = sequelize.define("Code", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  codeType: {
    type: DataTypes.ENUM("emailVerification", "forgotPassword"),
  },

  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: new Date(Date.now() + 5 * 60000)
  },
});
Code.belongsTo(User, { foreignKey: "userId" });
Code.sync({force: true});
