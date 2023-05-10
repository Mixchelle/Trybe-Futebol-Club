import { DataTypes, Model } from 'sequelize';
import db from '.';


export interface TeamAttributes {
  id: number;
  team_name: string;
}

export class Team extends Model<TeamAttributes> implements TeamAttributes {
  public id!: number;
  public team_name!: string;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    team_name: {
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
  }
);

export default Team;
