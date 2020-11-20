'use strict';

import { initState } from './state';
import { connect, play } from './network';
import { downloadAssets } from './assets';
import { startGameDrawing, startMenuDrawing } from './view';
import { startCapturingInput, stopCapturingInput } from './input';
import { hideLeadersTable, showLeadersTable } from './leadersTable';

import './css/bootstrap-reboot.css';
import './css/main.css';

const mainMenu = document.getElementById('menu');
const startGameButton = document.getElementById('play');
const username = document.getElementById('username');

const handleEndOfGame = () => {
  stopCapturingInput();
  startMenuDrawing();
  mainMenu.classList.remove('hidden');
  hideLeadersTable();
};

const main = () => {
  Promise.all([
    connect(handleEndOfGame),
    downloadAssets(),
  ]).then(() => {
    mainMenu.classList.remove('hidden');
    startGameButton.onclick = () => {
      play(username.value);
      mainMenu.classList.add('hidden');
      initState();
      startCapturingInput();
      startGameDrawing();
      showLeadersTable();
    };
  }).catch(console.error);
};

main();
