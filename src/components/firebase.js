import { initializeApp } from "firebase/app";
import { getFireStore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxh4cuNDSdF3P5LGXiJZ7b9DRfd6VpLwk",
  authDomain: "rtgt-b86c0.firebaseapp.com",
  projectId: "rtgt-b86c0",
  storageBucket: "rtgt-b86c0.appspot.com",
  messagingSenderId: "282700079028",
  appId: "1:282700079028:web:1cd64b900ac785d6ad5ce1",
  measurementId: "G-TG80SGDWXG",
};
const app = initializeApp(firebaseConfig);

export default getFireStore();
