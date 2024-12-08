function cat() {
    let img = document.createElement("img")
    var x = event.clientX;     // get the horizontal coordinate
    var y = event.clientY;   // get the vertical coordinate
    fetch("https://api.thecatapi.com/v1/images/search").then((a) => a.json().then((a) => {

        img.src = a[0]['url']
        

        // position newthing using the coordinates
        img.style.position = "fixed"; // fixes el relative to page. Could use absolute.
        img.style.left = (x-50) + "px";
        img.style.top = (y-50) + "px";

        document.body.appendChild(img);
        setTimeout(function() {
            img.remove()
        }, 4000);
            
                        
        }))
    
    
}