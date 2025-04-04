window.ondataload = () => { }
        fetch("https://api.lanyard.rest/v1/users/681177693831823363").then((a) => a.json().then((a) => {
            landyard = a.data
            if (landyard['discord_status'] == "dnd") {status = "dnd";
            }   else if (landyard['discord_status'] == "offline") {status = "offline";
            }   else if (landyard['discord_status'] == "online") {status = "online";
            }   else if (landyard['discord_status'] == "idle") {status = "idle";
            }   else {status = "error."}
			
			for (i in landyard.activities) {
				console.log(landyard.activities[i])
				if (landyard.activities[i].id != "spotify:1") {
					if (landyard.activities[i].id != "custom") {
                        status += " &mdash; "+landyard.activities[i].name
					} else {
						status += " &mdash; "+landyard.activities[i].state
					}
                }
			}

            document.getElementsByClassName("statusText")[0].innerHTML = status
            

            spotify = landyard['spotify']
            if (landyard['listening_to_spotify'] == true || landyard['listening_to_spotify'] == "true") {
                document.getElementsByClassName("statusText")[0].innerHTML = "<button class='spotifybtn' onclick='currentlyPlaying()'><i class='bx bx-fw bxl-spotify'></i></button> " + status
                //music = "listening to </i>    <i class='bx bxl-spotify'></i> <i>"+landyard.spotify['song']+" — "+landyard.spotify['artist'].replaceAll(";", ",")
            }
                        
        }))

function currentlyPlaying() {
    fetch("https://api.lanyard.rest/v1/users/681177693831823363").then((a) => a.json().then((a) => {
            landyard = a.data
            
            spotify = landyard['spotify']
            music = "</i><i>"+landyard.spotify['song']+" — "+landyard.spotify['artist'].replaceAll(";", ",")
            document.getElementsByClassName("statusTextspot")[0].classList.add("spotifyanim")
            document.getElementsByClassName("statusTextspot")[0].innerHTML = music
            setTimeout(function() {
                document.getElementsByClassName("statusTextspot")[0].classList.remove("spotifyanim")
                document.getElementsByClassName("statusTextspot")[0].innerHTML = ""
            }, 5500)
            }
                        
        ))
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
