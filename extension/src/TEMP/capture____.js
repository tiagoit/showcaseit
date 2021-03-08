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
    data.location = { distance }; // , userLoc: coords
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
  // store(data)
  fetchingProfileData = false;
  refreshObservers();
  return data;
};

const startCapturing = async (m) => {
  // refreshObservers();
  // if (fetchingProfileData) return;

  let sliderStyle = document.querySelector('div[aria-hidden="false"] span[class~="keen-slider__slide"] > div[class~="StretchedBox"]');
  sliderStyle = sliderStyle.getAttribute('style') || document.querySelectorAll('div[class~="profileCard__slider__img"]')[0].getAttribute('style');
  if(!sliderStyle) console.log('##################### ERROR: sliderStyle not found');
  const currentPageProfileId = sliderStyle.split(' ').filter(s=> s.includes('url'))[0].replace('url("', '').replace('");', '').split('/')[3];;

  if(currentPageProfileId !== profileId) {
    console.log('New profile, make your magic!');
    profileId = currentPageProfileId;
    try {
      if(!fetchingProfileData) return (await fetchProfileData());
    } catch(e) {
      console.log('Error fetching data: ', e);
      fetchingProfileData = false;
    }
  }
}

const refreshObservers = () => {
  if(observer1) observer1.disconnect();
  if(observer2) observer2.disconnect();

  observer1 = observeDOM(document.querySelector('div[class~="recsCardboard__cards"]'), startCapturing);
  observer2 = observeDOM(document.querySelector('div[class~="profileCard__slider"]'), startCapturing);
}

const pauseCapturing = () => {
  if(observer1) observer1.disconnect();
  if(observer2) observer2.disconnect();
}


new Promise(async (resolve, reject) => {
  await startCapturing();
  resolve('ok') ;
})
