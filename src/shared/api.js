import axios from 'axios';
import config from './config';

/**
 * @returns {Array} - Returns an array of image locations from the api.
 */
export const images = async function () {
  return await axios.get(config.api + `info?type=images`).then(d => {
    return d.data;
  });
}

/**
 * @returns {Array} - Returns an array of sticker locations from the api.
 */
export const stickers = async function () {
  return await axios.get(config.api + `info?type=stickers`).then(d => {
    return d.data;
  });
}