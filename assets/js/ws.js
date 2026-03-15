// constants

const WS_OP = {
    EVENT: 0,
    HELLO: 1,
    INIT: 2,
    HEARTBEAT: 3
}

// DOM
const DOM = {
    picture: document.querySelector('#profile-picture'),
    username: document.querySelector('#username'),
    status: document.querySelector('#status'),
    spotifyStatus: document.querySelector('#spotify'),
    links: document.querySelector('#links'),
};

// some variables
const discordUserId = "681177693831823363"; // has to be a string cuz ts(80008)
let heartbeatInterval = 30*1000 // 30s - default heartbeat for lanyard, i havent seen any other

// declerations
let alreadyRan = false; // for hiding the please enable javascript message
let cachedLanyard;
let ws;

// websocket functions
function connectWS() {
  ws = new WebSocket("wss://api.lanyard.rest/socket");

  // websocket events
  ws.addEventListener("open", () => {
    logWS('opened!')
  });
  
  ws.addEventListener("close", () => {
    logWS('closed! attempting reconnection...')
    ws = undefined;
    setTimeout(() => { // reconnect after 2.5s
        connectWS();
    }, 2500);
  });
  
  ws.addEventListener("message", handleEvent);
}

function handleEvent(event) {
    const eventJSON = JSON.parse(event.data)
    logWS(eventJSON)
  
    switch (eventJSON.op) {
      case WS_OP.EVENT:
          switch (eventJSON.t) {
              case "INIT_STATE": // initial state, shows spotify (if available) unlike presence update
                  cachedLanyard = eventJSON.d[discordUserId]
                  handlePresenceUpdate(cachedLanyard)
                  showSong(cachedLanyard)
                  break
              case "PRESENCE_UPDATE":
                  cachedLanyard = eventJSON.d
                  handlePresenceUpdate(eventJSON.d)
          }
          break
      case WS_OP.HELLO:
          ws.send(JSON.stringify({
              op: WS_OP.INIT,
              d: {
                  subscribe_to_ids: [discordUserId]
              }
          }))
      
          heartbeatInterval = eventJSON.d.heartbeat_interval
          heartbeat()
    }
}

function logWS(message) {
  const style = 'background:#2478ef;color:black;padding:2px 6px;border-radius:6px;'
  console.log(`%cws%c`, style, "", message);
}

window.addEventListener('pageshow', (e) => {
  if (e.persisted) connectWS();
});

window.addEventListener('beforeunload', () => {
  if (ws) ws.close();
});

// ws init
connectWS();

// ws heartbeat

let heartbeatTimer;

function heartbeat() {
    clearTimeout(heartbeatTimer);

    heartbeatTimer = setTimeout(() => {
        ws.send(JSON.stringify({ op: WS_OP.HEARTBEAT }));
        heartbeat();
    }, heartbeatInterval);
}

// ws update functions

function buildStatus(lanyard) {
    const currentStatus = lanyard.discord_status
    const validStatuses = ['dnd', 'idle', 'offline', 'online']

    let status = validStatuses.includes(currentStatus) ? currentStatus : "error."

    for (const activity of lanyard.activities) {
        switch (activity.id) {
            case 'spotify:1':
                break
            case 'custom':
                status += ` — <i>${activity.state}</i>`
                break
            default:
                status += ` — ${activity.name}`
        }
    }

    return status
}

function createSpotifyButton() {
    const spotifyBtn = document.createElement("button")
    spotifyBtn.classList.add("spotifybtn")
    spotifyBtn.id = 'spotify-btn'
    // spotifyBtn.setAttribute('onclick', 'showSong()')
    spotifyBtn.addEventListener('click', () => showSong())
    spotifyBtn.innerHTML = "<i class='bx bx-fw bxl-spotify'></i>"
    spotifyBtn.ariaLabel = "Spotify Button"

    return spotifyBtn
}

function handleStatusAnimation() {
    const statusEl = document.querySelector('#status')

    statusEl.classList.remove('show')
    statusEl.classList.add('hide')

    setTimeout(() => {
        statusEl.classList.add('show')
        statusEl.classList.remove('hide')
    }, 1000);
}

function updateSpotifyStatus(status, spotifyBtn) {
    const statusEl = document.querySelector('#status')
    const usualStatus = "<button id=\"spotify-btn\" class=\"spotifybtn\" aria-label=\"Spotify Button\"><i class=\"bx bx-fw bxl-spotify\"></i></button>" + status

    let currentTimeout = 0

    if ((statusEl.innerHTML != usualStatus) && alreadyRan) { // if status changed and already ran 
        handleStatusAnimation()
        currentTimeout = 300
    }

    setTimeout(() => {
        DOM.status.textContent = ''
        DOM.status.appendChild(spotifyBtn)
        DOM.status.insertAdjacentHTML('beforeend', status)
    }, currentTimeout);
}

function updateStatus(status) {
    const statusEl = document.querySelector('#status')
    const usualStatus = status

    let currentTimeout = 0

    if ((statusEl.innerHTML != usualStatus) && alreadyRan) { // if status changed and already ran 
        handleStatusAnimation()
        currentTimeout = 300
    }

    setTimeout(() => {
        const spotifyBtn = document.querySelector("#spotify-btn");
        if (spotifyBtn) spotifyBtn.remove()
        DOM.status.innerHTML = status
    }, currentTimeout);
}

function handlePresenceUpdate(lanyard) {
    if (!lanyard) return
    const status = buildStatus(lanyard);

    if (lanyard.listening_to_spotify) {
        const spotifyBtn = createSpotifyButton()
        updateSpotifyStatus(status, spotifyBtn)
    } else {
        updateStatus(status)
    }

    if (!alreadyRan) {
        alreadyRan = true
        DOM.status.classList.add("show")
    }
}

// show song

function showSong(lanyard) {
    if (!lanyard) lanyard = cachedLanyard

    if (lanyard.spotify) {
        const spotify = lanyard.spotify

        if (spotify === null) return

        const music = "</i><i>"+spotify.song+" — "+spotify.artist.replaceAll(";", ",")

        const status = DOM.spotifyStatus

        status.classList.add("show")
        status.classList.add("spotifyanim")
        status.innerHTML = music

        setTimeout(function() {
            status.classList.remove("spotifyanim")
            status.textContent = ""
        }, 5500)
    }
}