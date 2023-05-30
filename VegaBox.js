if (!process.env.PORT) {
    process.env.PORT = 8080;
}

var mime = require('mime');
var formidable = require('formidable');
var http = require('http');
var fs = require('fs-extra');
var util = require('util');
var path = require('path');
const { readdir } = require('fs');

var dataDir = "./data/";

var streznik = http.createServer(function(zahteva, odgovor) {
    if (zahteva.url == '/') {
        posredujOsnovnoStran(odgovor);
    } else if (zahteva.url == '/datoteke') { 
        posredujSeznamDatotek(odgovor);
    } else if (zahteva.url == "/nalozi") {
        naloziDatoteko(zahteva, odgovor);
    } else if (zahteva.url.startsWith('/prenesi')) { 
        posredujStaticnoVsebino(odgovor, dataDir + zahteva.url.replace("/prenesi", ""), "application/octet-stream");
    } else if (zahteva.url.startsWith('/brisi')) { 
        izbrisiDatoteko(odgovor, dataDir + zahteva.url.replace("/brisi", ""));
    } else {
        posredujStaticnoVsebino(odgovor, './public' + zahteva.url, "");
    }
});


// TODO 2.0 Dopolni spodnji klic funkcije z manjkajočim parametrom oz. imenom osnovne strani.
/**
 *  Posreduje statično vsebino osnovne strani.
 *  
 *  @param {HTTPresponse} odgovor odgovor od strežnika
 *  @param {String} path absolutna pot do datoteke osnovne strani vegabox.html
 *  @param {mimeType} mimeType prazen niz "" ki predstavlja format MIME od zahtevane vsebine
 */
function posredujOsnovnoStran(odgovor) {
    posredujStaticnoVsebino(odgovor, './public/vegabox.html', "");
}


/**
 *  Posreduje seznam datotek, ki se nahajajo v mapi data.
 *  
 *  @param {HTTPresponse} odgovor odgovor od strežnika v obliki JSON
 */
function posredujSeznamDatotek(odgovor) {
    odgovor.writeHead(200, {'Content-Type': 'application/json'});
    readdir(dataDir, function(napaka, datoteke) {
        if (napaka) {
            return napaka;
        } else {
            var seznamDatotek = [];
            for (var i=0; i<datoteke.length; i++) {
                var datoteka = datoteke[i];
                var velikost = fs.statSync(dataDir+datoteka).size;    
                seznamDatotek.push({datoteka: datoteka, velikost: velikost});
            }
            
            odgovor.write(JSON.stringify(seznamDatotek));
            odgovor.end();      
        }
    });
}


// TODO 4.0 Naloži novo izbrano datoteko v prikazan seznam datotek.
/**
 *  Naloži novo datoteko iz lokalnega datotečnega sistema (file-system)
 *  v spletni servis VegaBox.
 *  
 *  @param {HTTPrequest} zahteva zahteva za strežnika
 *  @param {HTTPresponse} odgovor odgovor od strežnika v obliki JSON
 */
function naloziDatoteko(zahteva, odgovor) {
    var form = new formidable.IncomingForm();
 
    form.parse(zahteva, function(napaka, polja, datoteke) {
        util.inspect({
            fields: polja, 
            files: datoteke
        });
    });
 
    form.on('end', function(fields, files) {
        var zacasnaPot = this.openedFiles[0].path;
        var datoteka = this.openedFiles[0].name;
        fs.copy(zacasnaPot, dataDir + datoteka, function(napaka) {  
            if (napaka) {
                return napaka;
            } else {
                posredujOsnovnoStran(odgovor);        
            }
        });
    });
}

/**
 *  Posreduje zahtevano datoteko uporabniku, če ta obstaja na strežniku.
 * 
 *  @param {HTTPresponse} odgovor odgovor od strežnika z zahtevano vsebino
 *  @param {String} absolutnaPotDoDatoteke absolutna pot do datoteke <ime-datoteke>.html
 *  @param {mimeType} mimeType prazen niz "", ki predstavlja format MIME od zahtevane vsebine
*/
function posredujStaticnoVsebino(odgovor, absolutnaPotDoDatoteke, mimeType) {
    fs.exists(absolutnaPotDoDatoteke, function(datotekaObstaja) {
        if (datotekaObstaja) {
            fs.readFile(absolutnaPotDoDatoteke, function(napaka, datotekaVsebina) {
                if (napaka) {
                    return napaka;
                } else {
                    posredujDatoteko(odgovor, absolutnaPotDoDatoteke, datotekaVsebina, mimeType);
                }
            })
        } else {
           return napaka;
        }
    });
}

/**
 *  Posreduje zahtevano datoteko uporabniku kot HTTPresponse (odgovor) od strežnika.
 * 
 *  @param {HTTPresponse} odgovor odgovor od strežnika z zahtevano vsebino
 *  @param {String} datotekaPot pot do datoteke, ki želimo posredovati uporabniku
 *  @param {File} datotekaVsebina vsebina datoteke, ki želimo posredovati uporabniku
 *  @param {mimeType} mimeType niz, ki predstavlja format MIME od zahtevane vsebine, kateri 
 *                             posodobimo format glede na tipologijo vira v Header polju odgovora stržnika
*/
function posredujDatoteko(odgovor, datotekaPot, datotekaVsebina, mimeType) {
    if (mimeType == "") {
        odgovor.writeHead(200, {'Content-Type': mime.lookup(path.basename(datotekaPot))});    
    } else {
        odgovor.writeHead(200, {'Content-Type': mimeType});
    }
    
    odgovor.end(datotekaVsebina);
}

// TODO 6.0 Dopolni funkcijo za izbris datoteke iz seznama.
/**
 *  Izbriše izbrano datoteko iz prisotnega seznama naloženih datotek.
 *  
 *  @param {HTTPresponse} odgovor odgovor od strežnika za zahtevano vsebino
 *  @param {String} absolutnaPotDoDatoteke absolutna pot do datoteke <ime-datoteke>, ki želimo izbrisati iz
 *                                         seznama datotek in iz mape /data
*/
function izbrisiDatoteko(odgovor, absolutnaPotDoDatoteke) {
    fs.exists(absolutnaPotDoDatoteke, function(datotekaObstaja) {
        if(datotekaObstaja) {
            fs.remove(absolutnaPotDoDatoteke, function(napaka) {
                if(!napaka) {
                    alert("Datoteka je bila izbrisana iz seznama.");
                } else {
                   return napaka;
                }
            });
        }
    });
}