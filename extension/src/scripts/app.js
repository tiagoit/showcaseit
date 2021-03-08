firebase.initializeApp(firebaseConfig);

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

document.getElementById('btn-capture').addEventListener('click', async () => {
  console.log('click: btn-capture');
  // Inject Main script
  chrome.tabs.query({currentWindow: true, url: '*://tinder.com/*'}, tabs => {
    tabs.forEach(tab => chrome.tabs.executeScript(tab.id, { file: 'scripts/capture.js' }));
  });
});

document.getElementById('btn-fetch-profiles').addEventListener('click', async () => {
  console.log('click: btn-fetch-profiles');
  chrome.tabs.query({currentWindow: true, url: '*://tinder.com/*'}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.executeScript(tab.id, { file: 'scripts/profiles-fetcher.js' }, async result => {
        console.log('captured')
        console.log({result}, {firebase});
        for(let profileId of Object.keys(result[0])) {
          if(result[0][profileId].location) {
            result[0][profileId].location.userLoc = coords;
          }
          store(result[0][profileId])
        }
      });
    });
  });
});

window.onload = function() {
  initApp();
  getUserLocation();
};