var i = 3.9;

function roundAndAddZeros(num) {
    var num = Math.round(num * 100) / 100
    var numstringified = num.toString()
    var nsl = numstringified.length
    if (nsl == 1) {
        num += ".00"
    } else if (nsl == 3) {
        num += "0"
    }
    return num
}

function waitforredirect() {
  setTimeout(function() {
    
    document.getElementsByClassName('toptxt')[0].innerHTML = "redirecting to the main page in "+roundAndAddZeros(i)+"s"
    i-=.01;
    if (i > -.01) {
        waitforredirect();
    }   else {
        window.location.href = "../"
    }
  }, 10)
  
}

waitforredirect();