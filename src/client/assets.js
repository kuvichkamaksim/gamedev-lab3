'use strict';

import { ASSET_NAMES } from '../utils/constants';

const assets = {};

const downloadAsset = (assetName) => {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
};

export const downloadAssets = () => Promise.all(ASSET_NAMES.map(downloadAsset));
export const getAsset = assetName => assets[assetName];
