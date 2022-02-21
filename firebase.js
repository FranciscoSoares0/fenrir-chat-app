import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCMe4GjuJCGTAIKGmoFd_sk4q_pEqp1jqI",
    authDomain: "fenrir-a4b93.firebaseapp.com",
    projectId: "fenrir-a4b93",
    storageBucket: "fenrir-a4b93.appspot.com",
    messagingSenderId: "988424414931",
    appId: "1:988424414931:web:8290a807c6de9b99519626"
  }; 

  const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

  const db =app.firestore();
  const auth=app.auth();
  const provider=new firebase.auth.GoogleAuthProvider();

  export{db,auth,provider};