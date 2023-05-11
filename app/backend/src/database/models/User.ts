import { DataTypes, Model } from 'sequelize';
import db from '.';

interface UserAttributes {
  id: number;
  userName: string;
  role: string;
  email: string;
  password: string;
}

class User extends Model<UserAttributes> {
  public id!: number;
  public userName!: string;
  public role!: string;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    underscored: true,
    timestamps: false,
    modelName: 'User',
    tableName: 'users',
  },
);

export default User;
