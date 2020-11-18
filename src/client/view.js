'use strict';

import { getAsset } from './assets';
import { getLatestState } from './state';
import { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } from '../utils/constants';

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
canvas.width = size;
canvas.height = size;

const drawBackground = (x, y) => {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;

  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );

  backgroundGradient.addColorStop(0, 'blue');
  backgroundGradient.addColorStop(1, 'green');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
};

const drawPlayer = (me, player) => {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  const playerAssetFileName = `player${player.id}.png`;

  // draw player
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset(playerAssetFileName),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  // draw health
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  );
};

const drawBullet = (player, bullet) => {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.png'),
    canvas.width / 2 + x - player.x - BULLET_RADIUS,
    canvas.height / 2 + y - player.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
};

const drawMainMenu = () => {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  // drawBackground(x, y);
};

let drawInterval = setInterval(drawMainMenu, 1000 / 60);

const render = () => {
  const { player, enemies, bullets } = getLatestState();
  if (!player) {
    return;
  }

  // drawBackground(player.x, player.y);

  // draw sides
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - player.x, canvas.height / 2 - player.y, MAP_SIZE, MAP_SIZE);

  bullets.forEach((bullet) => drawBullet(player, bullet));

  drawPlayer(player, player);
  enemies.forEach((enemy) => drawPlayer(player, enemy));
};

export const startGameDrawing = () => {
  clearInterval(drawInterval);
  drawInterval = setInterval(render, 1000 / 60);
};

export const startMenuDrawing = () => {
  clearInterval(drawInterval);
  drawInterval = setInterval(drawMainMenu, 1000 / 60);
};
