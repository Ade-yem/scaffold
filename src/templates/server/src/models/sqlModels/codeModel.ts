
  import {DataTypes} from "sequelize";
  import { sequelize } from "..";

  export const Code = sequelize.define(
    "Code",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      codeType: {
        type: DataTypes.ENUM("emailVerification", "forgotPassword"),

      },
    
      expiresAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now() + 300000,
      },
    }

  );
  Code.sync();
  