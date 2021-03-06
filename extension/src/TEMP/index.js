// Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// The body of this function will be executed as a content script inside the
// current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }



/* ############################################################################################# */
                                ///// SIGNIN
/* ############################################################################################# */

document.getElementById('btn-signin').addEventListener('click', async () => {
  console.log('btn-signin clicked');
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;
  console.log(email, password);


  // console.log(firebase);
});



/* ############################################################################################# */
                                ///// ON LOAD
/* ############################################################################################# */

let auth = null;
const loadScript = async (url) => {
  const script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
  await sleep(1000);
}
const register = async (email, password) => {
  try {
    auth = await firebase.auth().createUserWithEmailAndPassword(email, password);
    console.log('New user', {auth})
  } catch(error) { console.log({ code: error.code, message: error.message }) };
}
const login = async (email, password) => {
  try {
    auth = await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log('Logged in: ', {auth});
  } catch(error) { console.log({ code: error.code, message: error.message }) };
}
const add = (data) => {
  console.log({uid: auth.user.uid});
  firebase.firestore().collection('profiles').doc(auth.user.uid).update({ [data.profileId]: data });
}
const firebaseConfig = {
  apiKey: 'AIzaSyComtuLGFguBD1bwsKjIVHWEHI2T_b_RGk',
  authDomain: 'instamatcher.firebaseapp.com',
  projectId: 'instamatcher',
  storageBucket: 'instamatcher.appspot.com',
  messagingSenderId: '251163997683',
  appId: '1:251163997683:web:ebe3b6d29bd9105a034e86',
  measurementId: 'G-39GB92H91C'
};

console.log('extension: doc loaded');
// Initialize Firebase
(async () => {
  await loadScript('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
  await loadScript('https://www.gstatic.com/firebasejs/8.2.9/firebase-auth.js');
  await loadScript('https://www.gstatic.com/firebasejs/8.2.9/firebase-firestore.js');
  console.log({firebase});
  if(firebase) await firebase.initializeApp(firebaseConfig);
  else console.log('error initializing firebase');

  // register('tiferreira12@gmail.com', '123123');
  await login('tiferreira12@gmail.com', '123123');
})()