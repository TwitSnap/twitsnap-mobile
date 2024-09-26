
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCE_32C2R6RZxO4bGSiu09OLtHashZwnVw",
  authDomain: "twitsnap-57128.firebaseapp.com",
  projectId: "twitsnap-57128",
  storageBucket: "twitsnap-57128.appspot.com",
  messagingSenderId: "450665613455",
  appId: "1:450665613455:web:971648f2932566623c08fa"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export { auth };