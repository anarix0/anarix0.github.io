const lanyard_url = "https://api.lanyard.rest/v1/users/681177693831823363"

function updateStatus() {
    fetch(lanyard_url).then((a) => a.json().then((a) => {
        let status;

        const landyard = a.data;
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
            
            statusText.innerHTML = ''

            statusText.appendChild(spotifyBtn)

            statusText.innerHTML = statusText.innerHTML + status
        } else {
            statusText.innerHTML = status
        }                    
    }))
}

function currentlyPlaying() {
    fetch(lanyard_url).then((a) => a.json().then((a) => {
            spotify = a.data['spotify']

            music = "</i><i>"+spotify['song']+" — "+spotify['artist'].replaceAll(";", ",")

            document.getElementsByClassName("statusTextspot")[0].classList.add("spotifyanim")
            document.getElementsByClassName("statusTextspot")[0].innerHTML = music
    
            setTimeout(function() {
                document.getElementsByClassName("statusTextspot")[0].classList.remove("spotifyanim")
                document.getElementsByClassName("statusTextspot")[0].innerHTML = ""
            }, 5500)
            }
        ))
}
window.onload = () => {
    currentlyPlaying()
    updateStatus()
}

function hideAll() {
    document.getElementsByTagName("img")[0].classList.add("fadeoutimg")
    document.getElementsByTagName("h2")[0].classList.add("fadeoutimg")
    document.getElementsByTagName("h3")[0].classList.add("fadeoutimg")
    document.getElementsByClassName("links")[0].classList.add("fadeout")
    setTimeout(function() {
        window.location.href = "/donate"
    }, 500)
}
