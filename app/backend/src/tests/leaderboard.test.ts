// import * as sinon from 'sinon';
// import * as chai from 'chai';
// // @ts-ignore
// import chaiHttp = require('chai-http');
// import LeaderboardService from '../services/leaderboardService';
// import TeamService from '../services/teamService';
// import MatchService from '../services/matcheService';
// import expectedHomeData from './mockClass';

// chai.use(chaiHttp);

// const { expect } = chai;

// describe('leaderboard endpoint', () => {
//   afterEach(() => {
//     sinon.restore();
//   });

//   describe('Endpoint /leaderboard/home', () => {
//     it('should return the home leaderboard', async () => {


//       const getAllTeamsStub = sinon.stub(TeamService, 'getAllTeams').returns(Promise.resolve([{ id: 1, teamName: 'Team A' }, { id: 2, teamName: 'Team B' }]));
//       const getMatchesStub = sinon.stub(MatchService, 'getIn').returns(Promise.resolve([
//         { homeTeamId: 1, homeTeamGoals: 3, awayTeamId: 2, awayTeamGoals: 0, inProgress: false },
//         // Add more test match data...
//       ]));

//       sinon.stub(LeaderboardService, 'calculateTeamStats').callsFake((matches) => {
//         // Custom implementation to calculate team stats based on the provided test matches
//         // You can write your own logic to calculate the stats here
//         return Promise.resolve(expectedHomeData[0]);
//       });

//       const res = await chai.request(app).get('/leaderboard/home');

//       expect(res).to.have.status(200);
//       expect(res.body).to.deep.equal(expectedHomeData);
//       expect(getAllTeamsStub.calledOnce).to.be.true;
//       expect(getMatchesStub.calledOnce).to.be.true;
//     });
//   });

//   describe('Endpoint /leaderboard/away', () => {
//     it('should return the away leaderboard', async () => {
      

//       const getAllTeamsStub = sinon.stub(TeamService, 'getAllTeams').returns(Promise.resolve([{ id: 1, teamName: 'Team A' }, { id: 2, teamName: 'Team B' }]));
//       const getMatchesStub = sinon.stub(MatchService, 'getIn').returns(Promise.resolve([
//         { homeTeamId: 1, homeTeamGoals: 0, awayTeamId: 2, awayTeamGoals: 3, inProgress: false },
//         // Add more test match data...
//       ]));

//       sinon.stub(LeaderboardService, 'calculateTeamStats').callsFake((matches) => {
//         // Custom implementation to calculate team stats based on the provided test matches
//         // You can write your own logic to calculate the stats here
//         return Promise.resolve(expectedAwayData[0]);
//       });

//       const res = await chai.request(app).get('/leaderboard/away');

//       expect(res).to.have.status(200);
//       expect(res.body).to.deep.equal(expectedAwayData);
//       expect(getAllTeamsStub.calledOnce).to.be.true;
//       expect(getMatchesStub.calledOnce).to.be.true;
//     });
//   });
// });
