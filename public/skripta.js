// TODO 1.0 Dodaj EventListener za nalozitev spletne strani tipa 'load'
window.addEventListener('/* tip dogodka */', function() {
    var prizgiCakanje = function() {
        document.querySelector('.loading').style.display = /* TODO 1.1 Dodajte vrednost za PRIKAZ elementa */;
    }
    var ugasniCakanje = function() {
        document.querySelector('.loading').style.display = /* TODO 1.2 Dodajte vrednost za SKRITJE elementa */;
    }

    // TODO 2.O Dodaj 'click' EventListener elementu z id="nalozi"

    // Pridobi seznam datotek
    var pridobiSeznamDatotek = function(event) {
        // TODO 3.0 Kliči funkcijo prizgiCakanje
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                var datoteke = JSON.parse(xhttp.responseText);
                var datotekeHTML = document.querySelector('/* TODO 3.1 Dodaj element z ID datoteke */');

                /* TODO 3.2 Z zanko ZA pojdi skozi seznam datotek (datoteke.length) in izvedi naslednje korake:
                 *  1. določi spremenljivko, ki predstavlja datoteko
                 *  2. definiraj spremenljivko za velikost datoteke
                 *  3. definiraj spremenljivko za enoto z vrednostjo "B" (kot Byte)
                 */
                for (/* FIXME Dopolni zanko */) {
                    // TODO 3.2.1 Določitev spremenljivke dototeka
                    var dodatoteka = /* Koda gre sem... */;

                    // TODO 3.2.2 Določitev velikosti datoteke
                    var velikost = /* Koda gre sem... */;

                    // TODO 3.2.3 Določitev vrednosti osnovne merske enote velikosti datotek
                    var enota = /* Koda gre sem... */

                    datoteke.innerHTML += " \
                        <div class='datoteka'> \
                        <div class='naziv_datoteke'> " + datoteka.datoteka + " (" + velikost + " " + enota + ") </div> \
                        <div class='akcije'> \
                        | <span><a href='/prenesi/" + datoteka.datoteka + "' target='_self'>Prenesi</a></span> \
                        | <span akcija='brisi' datoteka='"+ datoteka.datoteka +"'>Izbriši</span> </div> \
                    </div>";
                }

                if (datoteke.length > 0) {
                    // TODO 3.3 Dodaj EventListener za dogodek click in klic funkcije brisi
                    document.querySelector("span[akcija=brisi]").addEventListener(/* Koda gre sem... */);
                }
                // TODO 3.4 Klici funkcijo ugasniCakanje()
            }
        };
    }

    var brisi = function(event) {
        // TODO 4.0 Klici funkcijo prizgiCakanje() 

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {

                /** 2. Preveri da lastnost responseText objekta xhttp odgovarja "Datoteka izbrisana",
                 *  v pozitivnem primeru preusmeri uporabnika na glavno stran (pomoč: window.location)
                 *  sicer sproži alert s sporočilom, ki sporoči uporabniku, da ni moč zbrisati datoteko
                 */
				if (xhttp.responseText == "Datoteka izbrisana") {
					window.location = /* FIXME Dopolni... */;
				} else {
					// TODO 4.1 Podaj sporočilo napake
				}
                // TODO4.2 Klici funkcijo ugasniCakanje()
			}
			
		};
        // TODO 5.0 Poglej sintakso funkcije .open() ter podaj zahtevo strežniku tipa GET
		xhttp.open("/* FIXME Dopolni... */", "/brisi/"+this.getAttribute("datoteka"), true);
		// TODO 5.1 Pošlji zahtevo strežniku s funkcijo send() na objektu xhttp
    }
});