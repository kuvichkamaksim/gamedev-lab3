'use strict';

const leaderboard = document.getElementById('leaderboard');
const rows = document.querySelectorAll('#leaderboard table tr');

export const updateLeadersTable = (playersScores) => {
  if (playersScores && playersScores.length) {
    // draw players' scores if we have ones
    playersScores.forEach(({ username, score }, index) => {
      rows[index + 1].innerHTML =
      `<td>${username.slice(0, 15) || 'No name'}</td><td>${score}</td>`;
    })
  } else {
    // for missed users draw empty lines
    for (let i = 0; i < 4; i++) {
      rows[i].innerHTML = '<td>-</td><td>-</td>';
    }
  }
};

export const hideLeadersTable = () => leaderboard.classList.add('hidden');
export const showLeadersTable = () => leaderboard.classList.remove('hidden');
