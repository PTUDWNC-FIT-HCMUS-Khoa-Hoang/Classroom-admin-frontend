import axios from 'axios';
import * as devEnv from './root.dev';
import * as prodEnv from './root.prod';

let apis;
if (process.env.NODE_ENV === 'production') {
  apis = prodEnv.default;
} else {
  apis = devEnv.default;
}

const baseDomain = apis.baseDomain; // API for products
export const basePostUrl = apis.basePostUrl; // API for post

const rootApi = axios.create({
  baseURL: baseDomain,
});

export default rootApi;
