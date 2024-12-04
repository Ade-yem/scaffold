import { DataTypes } from "sequelize";
import * as bcrypt from "bcryptjs";
import { sequelize } from "../index";

export const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: DataTypes.STRING,
    get() {
      return this.getDataValue("password");
    },
    set(val: string) {
      const rounds = 10;
      const salt = bcrypt.genSaltSync(rounds);
      const hashedPass = bcrypt.hashSync(val, salt);
      this.setDataValue("password", hashedPass);
    },
  },
});

User.sync();
