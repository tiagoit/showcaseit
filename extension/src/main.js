// Helpers
let profileId = null;
let fetchingProfileData = false;
let observer1 = null;
let observer2 = null;
const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));
const innerHTML = (node) => (node ? node.innerHTML : null);
const observeDOM = (function() {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function(obj, callback) {
    if(!obj || obj.nodeType !== 1) return; 

    if(MutationObserver) {
      var mutationObserver = new MutationObserver(callback);
      mutationObserver.observe(obj, { childList: true, subtree: true });
      return mutationObserver;
    } else if(window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();

const coords = {}
const getUserLocation = () => {
  var options = { enableHighAccuracy: false, timeout: 25000, maximumAge: Infinity };

  const success = (pos) => {
    coords.lat = pos.coords.latitude;
    coords.lon = pos.coords.longitude;
    console.log('User location ok.', pos.coords.latitude);
  };
  
  const error = (err) => { console.warn('ERROR(' + err.code + '): ' + err.message); };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

const fetchProfileData = async () => {
  await sleep(2000);
  const data = { profileId };
  fetchingProfileData = true;

  if(!document.querySelectorAll('div[class~="profileCard__slider__img"]').length) {
    document.querySelector('button[class*="Trsdu($normal)"]').click();
    await sleep(1000);
  }

  // Get name, age, description, tags
  data.name = innerHTML(document.querySelector("h1[itemprop='name']"));
  data.age = innerHTML(document.querySelector("span[itemprop='age']"));
  data.description = innerHTML(document.querySelector('div[class*="BreakWord"]'));
  data.tags = Array.from(document.querySelectorAll('div[class~="Bdrs(100px)"]')).map(t => innerHTML(t));

  // Others
  let otherData = Array.from(document.querySelectorAll('div[class="Row"] > div')).filter((el, idx) => idx % 2 !== 0).map(el => el.innerHTML);
  let distance = otherData.find(s => s.includes('quilômetro'));
  if(distance) {
    distance = +(distance.split(' ').find(s => Number.isInteger(+s)));
    data.location = { distance, userLoc: coords };
  }

  // Media
  let mediaButtons = document.querySelectorAll('div.Expand > div.CenterAlign > button');
  const photos = new Set();
  for(let i=1; i<mediaButtons.length; i++) {
    for(let photoNode of document.querySelectorAll('div[class~="profileCard__slider__img"]')) {
      if(!photoNode.getAttribute('style')) continue;
      photos.add(photoNode.getAttribute('style').split(' ').filter(s=> s.includes('url'))[0].replace('url("', '').replace('");', ''))
    }
    mediaButtons[i].click();
    await sleep(1000);
  }
  mediaButtons[0].click();
  data.media = Array.from(photos);

  console.log({ data })
  add(data)
  fetchingProfileData = false;
  refreshObservers();
};

const run = async (m) => {
  refreshObservers();
  if (fetchingProfileData) return;

  let style = null;
  if(document.querySelector('div[aria-hidden="false"] span[class~="keen-slider__slide"] > div[class~="StretchedBox"]')) {
    style = document.querySelector('div[aria-hidden="false"] span[class~="keen-slider__slide"] > div[class~="StretchedBox"]').getAttribute('style');
  } else {
    style = document.querySelectorAll('div[class~="profileCard__slider__img"]')[0].getAttribute('style')
  }
  if(!style) return;
  
  let currentPageProfileId = style.split(' ').filter(s=> s.includes('url'))[0].replace('url("', '').replace('");', '').split('/')[3];;

  if(currentPageProfileId !== profileId) {
    console.log('New profile, make your magic!');
    profileId = currentPageProfileId;
    try {
      if(!fetchingProfileData) await fetchProfileData();
    } catch(e) {
      console.log('Error fetching data: ', e);
      fetchingProfileData = false;
    }
  }
}

const refreshObservers = () => {
  if(observer1) observer1.disconnect();
  if(observer2) observer2.disconnect();

  observer1 = observeDOM(document.querySelector('div[class~="recsCardboard__cards"]'), run);
  observer2 = observeDOM(document.querySelector('div[class~="profileCard__slider"]'), run);
}

run();
getUserLocation();



let auth = null;
const loadScript = async (url) => {
  const script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
  await sleep(1000);
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

