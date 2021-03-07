firebase.initializeApp(firebaseConfig);

window.onload = function() {
  initApp();
  getUserLocation();
};

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


let isCapturing = false;

document.getElementById('btn-capture').addEventListener('click', async () => {
  if(isCapturing) {
    document.getElementById('btn-capture').textContent = 'Pause capturing';
    // let [tab] = await chrome.tabs.query({ url: '*tinder*' });
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   chrome.tabs.executeScript(
    //     tabs[0].id,
    //     { file: 'semantic-viewer.js' });
    // });

    

    // startCapturing();
  } else {
    document.getElementById('btn-capture').textContent = 'Start capturing';
    // pauseCapturing();
    console.log('start');
    chrome.tabs.query({currentWindow: true, url: '*://tinder.com/*'}, function(result) {
      result.forEach(function(tab) {
        console.log({tab});
        chrome.tabs.executeScript(
          tab.id,
          { file: 'scripts/capture.js' },
          result => {
            console.log({result});
          }
        );
      });
    });
  }

  isCapturing = !isCapturing;
});