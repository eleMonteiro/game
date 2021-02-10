import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD8OCqQJUAywRIgRHciWVyNOBuBvJ-fTeM",
  authDomain: "classifiqui-70e14.firebaseapp.com",
  databaseURL: "https://classifiqui-70e14-default-rtdb.firebaseio.com",
  projectId: "classifiqui-70e14",
  storageBucket: "classifiqui-70e14.appspot.com",
  messagingSenderId: "272221561285",
  appId: "1:272221561285:web:8d8b93cb66c12bbfca2bac",
  measurementId: "G-T37CK4F1KZ"
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