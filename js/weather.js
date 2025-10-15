// External JavaScript for weather site
// George A updated 2025

// Swap image function
function swapImage(imageSrc) {
    var imageBox = document.getElementById("change-image");
    imageBox.src = imageSrc;
}

// Preload images for faster swapping
const swapImageURLs = [
  "https://cdn.star.nesdis.noaa.gov/GOES16/ABI/GIFS/GOES16-CONUS-GEOCOLOR-625x375.gif",
  "https://cdn.star.nesdis.noaa.gov/GOES16/ABI/CONUS/10/625x375.jpg",
  "https://s.w-x.co/staticmaps/wu/wxtype/county_loc/pie/animate.png",
  "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/dynamic/wbbh/nbc2_watervapor_web.jpg?crop=1xw:1xh;center,top&resize=900:*",
  "https://www.weather.gov/images/tbw/graphicast/Today.png",
  "https://www.weather.gov/images/tbw/graphicast/Tonight.png",
  "https://www.weather.gov/images/tbw/graphicast/Tomorrow.png",
  "https://www.wpc.ncep.noaa.gov/qpf/p120i.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/allfcsts_loop_ndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/91fndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/92fndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/93fndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/94fndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/95fndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/96fndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/98fndfd.gif",
  "https://www.wpc.ncep.noaa.gov/basicwx/99fndfd.gif"
];
swapImageURLs.forEach(url => {
  const img = new Image();
  img.src = url;
});

// Service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw - ORIG.js')
        .then(reg => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err));
}

// DateDiv display logic
function showDateDivsByMonth() {
    var dateDivs = document.querySelectorAll(".DateDiv");
    var currentMonth = new Date().getMonth() + 1;
    dateDivs.forEach(function(dateDiv) {
        var dateRange = dateDiv.querySelector(".DateRange").textContent;
        var [dtFrom, dtTo] = dateRange.split(" to ").map(Number);
        if (currentMonth >= dtFrom && currentMonth <= dtTo) {
            dateDiv.style.display = "block";
        }
    });
}
document.addEventListener("DOMContentLoaded", showDateDivsByMonth);

// PWA installation logic
let deferredPrompt;
const installButton = document.getElementById('install-button-main');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', () => {
        installButton.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
          console.log(choiceResult.outcome === 'accepted' ? 
            'User accepted install' : 'User dismissed install');
          deferredPrompt = null;
        });
      });
  }
});
window.addEventListener("appinstalled", () => {
  console.log("PWA installed successfully!");
  if (installButton) installButton.style.display = "none";
  deferredPrompt = null;
});
window.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone) {
    console.log("App is running in standalone mode.");
    if (installButton) installButton.style.display = "none";
  }
});
