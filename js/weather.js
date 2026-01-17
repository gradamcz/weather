// External JavaScript for weather site
// George A updated 2025

/* -------------------------------------------------------
   IMAGE SWAP + PRELOAD
------------------------------------------------------- */

// Swap image function
function swapImage(imageSrc) {
  const imageBox = document.getElementById("change-image");
  if (imageBox) imageBox.src = imageSrc;
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

/* -------------------------------------------------------
   SERVICE WORKER
------------------------------------------------------- */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw - ORIG.js")
    .then(() => console.log("Service worker registered"))
    .catch(err => console.log("Service worker not registered", err));
}

/* -------------------------------------------------------
   DATE RANGE DISPLAY LOGIC
------------------------------------------------------- */

function showDateDivsByMonth() {
  const dateDivs = document.querySelectorAll(".DateDiv");
  const currentMonth = new Date().getMonth() + 1;

  dateDivs.forEach(div => {
    const rangeText = div.querySelector(".DateRange")?.textContent;
    if (!rangeText) return;

    const [dtFrom, dtTo] = rangeText.split(" to ").map(Number);

    if (currentMonth >= dtFrom && currentMonth <= dtTo) {
      div.style.display = "block";
    }
  });
}

document.addEventListener("DOMContentLoaded", showDateDivsByMonth);

/* -------------------------------------------------------
   PWA INSTALLATION — STATE MACHINE REFACTOR
------------------------------------------------------- */

const states = {
  CHECKING: "checking",
  STANDALONE: "standalone",
  INSTALL_AVAILABLE: "install_available",
  INSTALL_BLOCKED: "install_blocked",
  INSTALLING: "installing",
  INSTALLED: "installed"
};

let currentState = states.CHECKING;
let deferredPrompt = null;

const installButton = document.getElementById("install-button-main");
const fallbackBanner = document.getElementById("manual-install-banner");

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone
  );
}

function transition(nextState) {
  currentState = nextState;
  renderUI(nextState);
}

function renderUI(state) {
  switch (state) {
    case states.STANDALONE:
      hideInstallButton();
      hideFallbackBanner();
      break;

    case states.INSTALL_AVAILABLE:
      showInstallButton();
      hideFallbackBanner();
      break;

    case states.INSTALL_BLOCKED:
      hideInstallButton();
      showFallbackBanner();
      break;

    case states.INSTALLING:
      hideInstallButton();
      hideFallbackBanner();
      break;

    case states.INSTALLED:
      hideInstallButton();
      hideFallbackBanner();
      break;
  }
}

function showInstallButton() {
  if (installButton) installButton.style.display = "block";
}

function hideInstallButton() {
  if (installButton) installButton.style.display = "none";
}

function showFallbackBanner() {
  if (fallbackBanner) fallbackBanner.style.display = "block";
}

function hideFallbackBanner() {
  if (fallbackBanner) fallbackBanner.style.display = "none";
}

/* -------------------------------------------------------
   EVENT HANDLERS
------------------------------------------------------- */

// Browser says install is available
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  transition(states.INSTALL_AVAILABLE);
});

// User clicks install button
if (installButton) {
  installButton.addEventListener("click", () => {
    transition(states.INSTALLING);
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choice => {
      deferredPrompt = null;
      console.log(
        choice.outcome === "accepted"
          ? "User accepted install"
          : "User dismissed install"
      );
    });
  });
}

// App was installed
window.addEventListener("appinstalled", () => {
  console.log("PWA installed successfully!");
  transition(states.INSTALLED);
});

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  if (isStandalone()) {
    transition(states.STANDALONE);
    return;
  }

  // Wait to see if beforeinstallprompt fires
  setTimeout(() => {
    if (currentState === states.CHECKING) {
      transition(states.INSTALL_BLOCKED);
    }
  }, 1500);
});