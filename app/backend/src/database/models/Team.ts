import { DataTypes, Model } from 'sequelize';
import db from '.';

export interface TeamAttributes {
  id: number;
  teamName: string;
}

class Team extends Model<TeamAttributes> {
  declare id: number;
  declare teamName: string;
}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  underscored: true,
  timestamps: false,
  modelName: 'Team',
});

export default Team;
