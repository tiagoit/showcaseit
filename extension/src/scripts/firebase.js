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

let user = null;

function initApp() {
  firebase.auth().onAuthStateChanged(function(_user) {
    if (_user) {
      user = _user;
      var displayName = _user.displayName;
      var email = _user.email;
      var emailVerified = _user.emailVerified;
      var photoURL = _user.photoURL;
      var isAnonymous = _user.isAnonymous;
      var uid = _user.uid;
      var providerData = _user.providerData;
      document.getElementById('btn-auth').textContent = 'Sign out';
      document.getElementById('capture').style.display = 'block';
    } else {
      user = null;
      document.getElementById('btn-auth').textContent = 'Sign-in with Google';
    }
    document.getElementById('btn-auth').disabled = false;
    console.log({user});
  });

  document.getElementById('btn-auth').addEventListener('click', startSignIn, false);
}

function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

function startSignIn() {
  document.getElementById('btn-auth').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

const store = (data) => {
  console.log({uid: user.uid});
  firebase.firestore().collection('profiles').doc(user.uid).update({ [data.profileId]: data });
}