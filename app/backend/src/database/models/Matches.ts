import { DataTypes, Model } from 'sequelize';
import db from '.';
import Team from './Team';

export interface MatchAttributes {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

class Match extends Model<MatchAttributes> {
  public id!: number;
  public homeTeamId!: number;
  public homeTeamGoals!: number;
  public awayTeamId!: number;
  public awayTeamGoals!: number;
  public inProgress!: boolean;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id',
      },
    },
    homeTeamGoals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayTeamGoals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inProgress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    underscored: true,
    timestamps: false,
    modelName: 'Match',
    tableName: 'matches',
  },
);

Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeams' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeams' });

Team.hasMany(Match, { foreignKey: 'homeTeamId', as: 'homeMatches' });
Team.hasMany(Match, { foreignKey: 'awayTeamId', as: 'awayMatches' });

export default Match;
