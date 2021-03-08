// Avoids reinjection.
if(typeof window.profiles === 'undefined') {
  window.profiles = {};

  const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));
  
  const innerHTML = (node) => (node ? node.innerHTML : null);
  
  const getProfileId = async () => {
    let sliderStyle = document.querySelector('div[aria-hidden="false"] span[class~="keen-slider__slide"] > div[class~="StretchedBox"]');
    sliderStyle = sliderStyle ? sliderStyle.getAttribute('style') : document.querySelector('div[class~="profileCard__slider__img"]').getAttribute('style');
    if(sliderStyle) {
      return sliderStyle.split(' ').filter(s=> s.includes('url'))[0].replace('url("', '').replace('");', '').split('/')[3];;
    } else {
      console.log('##################### ERROR: sliderStyle not found');
      await sleep(1000);
      console.log('sliderStyle try again');
      return getProfileId();
    }
  }
  
  const openProfileDetails = async () => {
    if(!document.querySelectorAll('div[class~="profileCard__slider__img"]').length) {
      document.querySelector('button[class*="Trsdu($normal)"]').click();
      await sleep(1000);
    }
  }
  
  const scrapProfileData = () => {
    if(!document.querySelector("h1[itemprop='name']")) return {};
  
    const data = {}
    // Get name, age, description, tags
    data.name = innerHTML(document.querySelector("h1[itemprop='name']"));
    data.age = innerHTML(document.querySelector("span[itemprop='age']"));
    data.description = innerHTML(document.querySelector('div[class*="BreakWord"]'));
    data.tags = Array.from(document.querySelectorAll('div[class~="Bdrs(100px)"]')).map(t => innerHTML(t));
  
    // Others
    let otherData = Array.from(document.querySelectorAll('div[class="Row"] > div')).filter((el, idx) => idx % 2 !== 0).map(el => el.innerHTML);
    let distance = otherData.find(s => (s.includes('quilômetro') || s.includes('kilometre')));
    if(distance) {
      distance = +(distance.split(' ').find(s => Number.isInteger(+s)));
      data.location = { distance }; // , userLoc: coords
    }
    return data
  }
  
  const scrapMedia = () => {
    let mediaButtons = null;
    let photoNodes = null;
    // profile is open
    if(document.querySelector("h1[itemprop='name']")) {
      mediaButtons = document.querySelectorAll('div.Expand > div.CenterAlign > button');
      photoNodes = document.querySelectorAll('div[class~="profileCard__slider__img"]');
    } else {
      mediaButtons = document.querySelectorAll("div.recsCardboard > div > div.recsCardboard__cards > div.Wc\\(\\$transform\\) > div > div > button")
      photoNodes = document.querySelectorAll("main > div > div > div > div.recsCardboard > div > div.recsCardboard__cards > div.Wc\\(\\$transform\\) > div > div.keen-slider > span > div");
    }
    const photos = new Set();
    for(let i=1; i<mediaButtons.length; i++) {
      for(let photoNode of photoNodes) {
        if(!photoNode.getAttribute('style')) continue;
        photos.add(photoNode.getAttribute('style').split(' ').filter(s=> s.includes('url'))[0].replace('url("', '').replace('");', ''))
      }
    }
    return Array.from(photos);
  }
  
  const capture = async () => {
    const currentProfileId = await getProfileId();
    if(!window.profiles[currentProfileId]) window.profiles[currentProfileId] = { medias: new Set() };
    await openProfileDetails();
    const profileData = scrapProfileData();
    if(profileData) window.profiles[currentProfileId] = { ...window.profiles[currentProfileId], ...profileData };
    const medias = scrapMedia();
    const currentMediaSet = new Set(medias);
    const profileMediaSet = new Set(window.profiles[currentProfileId].medias)
    const mergedSets = new Set([...currentMediaSet, ...profileMediaSet]);
    window.profiles[currentProfileId].medias = Array.from(mergedSets);
    window.profiles[currentProfileId].profileId = currentProfileId;
    console.log('capture.js:73 | ', {p: window.profiles});
  }
  
  addEventListener('mousedown', capture, false);
  addEventListener('keyup', capture, false);
}
