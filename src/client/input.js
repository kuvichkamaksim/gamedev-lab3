'use strict';

import { updateDirection } from './network';

const onMouseInput = e => handleInput(e.clientX, e.clientY);

const onTouchInput = e => handleInput(e.touches[0].clientX, e.touches[0].clientY);

const handleInput = (x, y) => {
  const { innerHeight, innerWidth } = window;
  const dir = Math.atan2(x - innerWidth / 2, innerHeight / 2 - y);
  updateDirection(dir);
};

export const startCapturingInput = () => {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
};

export const stopCapturingInput = () => {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
};
