'use strict';

import { updateLeadersTable } from './leadersTable';
import { CLIENT_DELAY } from '../utils/constants';

const gameUpdates = [];
let lastGameUpdateTime = 0;
let firstServerResponseTime = 0;

export const initState = () => {
  lastGameUpdateTime = 0;
  firstServerResponseTime = 0;
};

export const onGameUpdate = (update) => {
  if (firstServerResponseTime === 0) {
    firstServerResponseTime = update.t;
    lastGameUpdateTime = Date.now();
  }

  gameUpdates.push({ player: update.me, enemies: update.others, bullets: update.bullets });
  updateLeadersTable(update.leaderboard);

  // keep only one game update earlier the server time
  const latestUpdateIndex = getLatestUpdateIndex();
  if (latestUpdateIndex > 0) gameUpdates.splice(0, latestUpdateIndex);
};

const currentServerTimestamp = () =>
  firstServerResponseTime + (Date.now() - lastGameUpdateTime) - CLIENT_DELAY;

// find the index of the latest game update
const getLatestUpdateIndex = () => {
  const serverTimestamp = currentServerTimestamp();
  return gameUpdates.slice().reverse().findIndex(({ t }) => t <= serverTimestamp);
};

const interpolateObjects = (object1, object2, coefficient) => {
  if (!object2) return object1;

  const interpolated = {};

  Object.keys(object1).forEach(key => {
    if (key === 'direction') {
      interpolated[key] = interpolateDirection(object1[key], object2[key], coefficient);
    } else {
      interpolated[key] = object1[key] + (object2[key] - object1[key]) * coefficient;
    }
  });

  return interpolated;
};

const interpolateArrayOfObjects = (objects1, objects2, coefficient) =>
  objects1.map(o => interpolateObjects(o, objects2.find(o2 => o.id === o2.id), coefficient));

// angles in radians
const interpolateDirection = (angle1, angle2, coefficient) => {
  const absDirectionDifference = Math.abs(angle2 - angle1);
  if (absDirectionDifference >= Math.PI) {
    if (angle1 > angle2) {
      return angle1 + (angle2 + 2 * Math.PI - angle1) * coefficient;
    } else {
      return angle1 - (angle2 - 2 * Math.PI - angle1) * coefficient;
    }
  } else {
    return angle1 + (angle2 - angle1) * coefficient;
  }
};

export const getLatestState = () => {
  if (firstServerResponseTime === 0) return null;

  const lastUpdateIndex = getLatestUpdateIndex();
  const serverTimestamp = currentServerTimestamp();

  if (lastUpdateIndex < 0 || lastUpdateIndex === gameUpdates.length - 1) {
    // if last update is the latest one, override current state with it
    return gameUpdates[gameUpdates.length - 1];
  } else {
    // if no, interpolate state between last update and next one
    const lastUpdate = gameUpdates[lastUpdateIndex];
    const nextUpdate = gameUpdates[lastUpdateIndex + 1];
    // client delay coefficient
    const coefficient =
      (serverTimestamp - lastUpdate.t) / (nextUpdate.t - lastUpdate.t);

    return {
      player: interpolateObjects(lastUpdate.me, nextUpdate.me, coefficient),
      enemies: interpolateArrayOfObjects(lastUpdate.others, nextUpdate.others, coefficient),
      bullets: interpolateArrayOfObjects(lastUpdate.bullets, nextUpdate.bullets, coefficient),
    };
  }
};
