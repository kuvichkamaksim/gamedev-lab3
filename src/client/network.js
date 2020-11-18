'use strict';

import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { onGameUpdate } from './state';

import { MESSAGES } from '../utils/constants';

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const onDisconnect = () => {
  console.log('You are disconnected.');
  document.getElementById('disconnect-modal').classList.remove('hidden');
  document.getElementById('reconnect-button').onclick = () => window.location.reload();
};

export const connect = (onGameOver) => {
  new Promise(resolve => {
    socket.on(MESSAGES.CONNECT, () => {
      console.log('You are connected.');
      resolve();
    });
  }).then(() => {
    socket.on(MESSAGES.GAME_UPDATE, onGameUpdate);
    socket.on(MESSAGES.GAME_OVER, onGameOver);
    socket.on(MESSAGES.DISCONNECT, onDisconnect);
  });
};

export const play = username => socket.emit(MESSAGES.JOIN_GAME, username);

export const updateDirection = throttle(10, dir => socket.emit(MESSAGES.INPUT, dir));
