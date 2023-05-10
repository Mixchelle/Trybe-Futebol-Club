import { DataTypes, Model } from 'sequelize';
import db from '.';

export interface TeamAttributes {
  id: number;
  teamName: string;
}

export class Team extends Model<TeamAttributes> implements TeamAttributes {
  public id!: number;
  public teamName!: string;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    underscored: true,
    timestamps: false,
    modelName: 'Team',
    tableName: 'teams',
  },
);

export default Team;
