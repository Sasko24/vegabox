window.addEventListener('load', function() {
    var prizgiCakanje = function() {
        document.querySelector('.loading').style.display = 'block';
    }
    var ugasniCakanje = function() {
        document.querySelector('.loading').style.display = 'none';
    }
    if(id="nalozi"){
        this.addEventListener(click);
    }
    
    var pridobiSeznamDatotek = function(event) {
        prizgiCakanje();
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                var datoteke = JSON.parse(xhttp.responseText);
                var datotekeHTML = document.querySelector('.datoteka');

                /* TODO 3.2 Z zanko ZA pojdi skozi seznam datotek (datoteke.length) in izvedi naslednje korake:
                 *  1. določi spremenljivko, ki predstavlja datoteko
                 *  2. definiraj spremenljivko za velikost datoteke
                 *  3. definiraj spremenljivko za enoto z vrednostjo "B" (kot Byte)
                 */
                for (let i = 0; i < datoteke.length ; i++) {
                    var dodatoteka = datoteka[i];
                    var velikost = datoteka.velikost;
                    var enota = "B";

                    datoteke.innerHTML += " \
                        <div class='datoteka'> \
                        <div class='naziv_datoteke'> " + datoteka.datoteka + " (" + velikost + " " + enota + ") </div> \
                        <div class='akcije'> \
                        | <span><a href='/prenesi/" + datoteka.datoteka + "' target='_self'>Prenesi</a></span> \
                        | <span akcija='brisi' datoteka='"+ datoteka.datoteka +"'>Izbriši</span> </div> \
                    </div>";
                }

                if (datoteke.length > 0) {
                    document.querySelector("span[akcija=brisi]").addEventListener("click", brisi());
                }
                ugasniCakanje();
            }
        };
    }

    var brisi = function(event) {
        prizgiCakanje(); 

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (xhttp.responseText == "Datoteka izbrisana") {
					window.location = "/";
				} else {
					window.alert("Datoteke ni moč zbrisati");
				}
                ugasniCakanje();
			}
			
		};
		xhttp.open("GET", "/brisi/"+this.getAttribute("datoteka"), true);
        xhttp.send();
    }
});