import * as firebase from 'firebase/app';
import * as auth from 'firebase/auth';
import ENV from '../env.json';

const config = {
    apiKey: ENV.FIREBASE.API_KEY,
    authDomain: ENV.FIREBASE.AUTH_DOMAIN,
    projectId: ENV.FIREBASE.PROJECT_ID
};

const app = firebase.getApps().length <= 0 && firebase.initializeApp(config);

export { auth };
