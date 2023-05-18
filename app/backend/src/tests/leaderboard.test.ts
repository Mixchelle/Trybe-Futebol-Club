// import * as sinon from 'sinon';
// import * as chai from 'chai';
// // @ts-ignore
// import chaiHttp = require('chai-http');
// const server = require('../app'); 

// chai.use(chaiHttp);

// const { expect } = chai;

// describe('leaderboard endpoint', () => {
//   afterEach(() => {
//     sinon.restore();
//   });

//   describe('Endpoint /leaderboard/home', () => {
//     it('should return the home leaderboard', (done) => {
//       const expectedHomeData = [
//         {
//           name: 'Team A',
//           totalPoints: 9,
//           totalGames: 3,
//           totalVictories: 3,
//           totalDraws: 0,
//           totalLosses: 0,
//           goalsFavor: 9,
//           goalsOwn: 1,
//           goalsBalance: 8,
//           efficiency: 100,
//         },
//         // Add more expected data for other teams...
//       ];

//       const getAllTeamsStub = sinon.stub(server.TeamService, 'getAllTeams').returns(Promise.resolve([{ id: 1, teamName: 'Team A' }, { id: 2, teamName: 'Team B' }])));
//       const getMatchesStub = sinon.stub(server.MatchService, 'getIn').returns(Promise.resolve([]));
//       const calculateTeamStatsStub = sinon.stub(server.LeaderboardService, 'calculateTeamStats').returns(Promise.resolve(expectedHomeData[0]));

//       chai.request(server)
//         .get('/leaderboard/home')
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body).to.deep.equal(expectedHomeData);
//           expect(getAllTeamsStub.calledOnce).to.be.true;
//           expect(getMatchesStub.calledOnce).to.be.true;
//           expect(calculateTeamStatsStub.calledOnce).to.be.true;
//           done();
//         });
//     });
//   });

