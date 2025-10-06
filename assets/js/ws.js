var heartbeat_interval = 10**10

const ws = new WebSocket("wss://api.lanyard.rest/socket");
const userId = "681177693831823363";

let cachedLandyard;
let firstRun;

ws.addEventListener("open", (event) => {
  console.log("ws opened!")
});

ws.addEventListener("close", (event) => {
  console.log("ws closed!")
});

ws.addEventListener("message", (event) => {
  var event_json = JSON.parse(event.data)

  console.log("ws", event_json);

  if (event_json.op == 1) {
    ws.send(`{ \"op\": 2, \"d\": { \"subscribe_to_ids\": [\"${userId}\"] } }`)
    heartbeat_interval = event_json.d.heartbeat_interval
    heartbeat()
  } else if (event_json.op == 0) {
    if (event_json.t == "INIT_STATE") {
        cachedLandyard = event_json.d[userId]
        WSupdateStatus(cachedLandyard)
        currentlyPlaying(cachedLandyard)
    } else if (event_json.t == "PRESENCE_UPDATE") {
        cachedLandyard = event_json.d
        WSupdateStatus(event_json.d)
    }
  }

});

function heartbeat() {
    setTimeout(() => {
        ws.send("{\"op\":3}")
        heartbeat()
    }, heartbeat_interval);
}

function WSupdateStatus(landyard) {
    // console.log(landyard)
    let status;

    const current_status = landyard['discord_status']
    const valid_statuses = ['dnd', 'idle', 'offline', 'online']

    status = valid_statuses.includes(current_status) ? current_status : "error."
	
	for (i in landyard.activities) {
		if (landyard.activities[i].id != "spotify:1") {
			if (landyard.activities[i].id != "custom") {
                status += " &mdash; "+landyard.activities[i].name
			} else {
				status += " &mdash; <i>"+landyard.activities[i].state+"</i>"
			}
        }
	}

    const statusText = document.getElementsByClassName("statusText")[0]
    spotify = landyard['spotify']

    if (landyard['listening_to_spotify'] == true) {
        const spotifyBtn = document.createElement("button")
        spotifyBtn.classList.add("spotifybtn")
        spotifyBtn.setAttribute('onclick', 'currentlyPlaying()')
        spotifyBtn.innerHTML = "<i class='bx bx-fw bxl-spotify'></i>"
        spotifyBtn.ariaLabel = "Spotify Button"

        usualStatus = "<button class=\"spotifybtn\" onclick=\"currentlyPlaying()\"><i class=\"bx bx-fw bxl-spotify\"></i></button>" + status.replace("&mdash;", "—")

        // console.log(statusText.innerHTML)
        // console.log(usualStatus)

        currentTimeout = 0

        if ((statusText.innerHTML != usualStatus) && firstRun) {
            console.log("DIFF STATUS")
            statusText.classList.remove('show')
            statusText.classList.add('hide')
            setTimeout(() => {
                statusText.classList.add('show')
                statusText.classList.remove('hide')
            }, 1000);
            currentTimeout = 300
        }

        setTimeout(() => {
           statusText.innerHTML = ''
            statusText.appendChild(spotifyBtn)
            statusText.innerHTML = statusText.innerHTML + status 
        }, currentTimeout);
    } else {
        var spotifybtn = document.body.getElementsByClassName("spotifybtn")[0]

        usualStatus = status.replace("&mdash;", "—")

        // console.log(statusText.innerHTML)
        // console.log(usualStatus)

        console.log(statusText.innerHTML == usualStatus)

        currentTimeout = 0

        if ((statusText.innerHTML != usualStatus) && firstRun) {
            // console.log("DIFF STATUS")
            statusText.classList.remove('show')
            statusText.classList.add('hide')
            setTimeout(() => {
                statusText.classList.add('show')
                statusText.classList.remove('hide')
            }, 1000);
            currentTimeout = 300
        }

        setTimeout(() => {
            if (spotifybtn) { spotifybtn.remove() }
            statusText.innerHTML = status
        }, currentTimeout);
    }

    if (!firstRun) {
        firstRun = true
        statusText.classList.add("show")
    }
}

function currentlyPlaying(landyard) {
    if (!landyard) {
        landyard = cachedLandyard
    }
    if (landyard.spotify) {
        spotify = landyard['spotify']

        music = "</i><i>"+spotify['song']+" — "+spotify['artist'].replaceAll(";", ",")

        const spotifyText = document.getElementsByClassName("statusTextspot")[0]

        spotifyText.classList.add("show")
        spotifyText.classList.add("spotifyanim")
        spotifyText.innerHTML = music

        setTimeout(function() {
            spotifyText.classList.remove("spotifyanim")
            spotifyText.innerHTML = ""
        }, 5500)
    }
}

function hideAll() {
    document.getElementsByTagName("img")[0].classList.add("fadeoutimg")
    document.getElementsByTagName("h2")[0].classList.add("fadeoutimg")
    document.getElementsByTagName("h3")[0].classList.add("fadeoutimg")
    document.getElementsByTagName("h3")[0].classList.remove("show")
    document.getElementsByClassName("links")[0].classList.add("fadeout")
    document.getElementsByClassName("statusTextspot")[0].classList.remove("spotifyanim")
    document.getElementsByClassName("statusTextspot")[0].innerHTML = ""
    setTimeout(function() {
        window.location.href = "/donate"
    }, 500)
    setTimeout(function() {
        document.getElementsByTagName("img")[0].classList.remove("fadeoutimg")
        document.getElementsByTagName("h2")[0].classList.remove("fadeoutimg")
        document.getElementsByTagName("h3")[0].classList.remove("fadeoutimg")
        document.getElementsByClassName("links")[0].classList.remove("fadeout")
    }, 1500)
}
