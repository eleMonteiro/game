import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

firebase.initializeApp(firebaseConfig)

const fb = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const db = firebase.database();

const storageRef = storage.ref()


export {
  //servicos
  fb,
  db,
  auth,
  storage,
  storageRef
}
