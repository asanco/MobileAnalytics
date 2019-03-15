
import firebase from 'firebase'

// Initialize Firebase
 var config = {
   apiKey: "AIzaSyBmpj71O_9s3i-1a84lf1wQCRCQzHXnh1M",
   authDomain: "psycotest-58247.firebaseapp.com",
   databaseURL: "https://psycotest-58247.firebaseio.com",
   projectId: "psycotest-58247",
   storageBucket: "psycotest-58247.appspot.com",
   messagingSenderId: "774004257613"
 };
 firebase.initializeApp(config);

 export default firebase;
