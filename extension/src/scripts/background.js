// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyComtuLGFguBD1bwsKjIVHWEHI2T_b_RGk',
  authDomain: 'instamatcher.firebaseapp.com',
  projectId: 'instamatcher',
  storageBucket: 'instamatcher.appspot.com',
  messagingSenderId: '251163997683',
  appId: '1:251163997683:web:ebe3b6d29bd9105a034e86',
  measurementId: 'G-39GB92H91C'
};
firebase.initializeApp(firebaseConfig);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
}

window.onload = function() {
  initApp();
};



// chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//   chrome.declarativeContent.onPageChanged.addRules([{
//     conditions: [
//       new chrome.declarativeContent.PageStateMatcher()
//     ],
//     actions: [new chrome.declarativeContent.ShowPageAction()]
//   }]);
// });
