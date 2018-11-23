// luodaan vähän efektiä listalle kun klikataan "Show Movies / Hide Movies" -nappia
$(document).ready(function() {
  $("#showHide").click(function() {
    $("#textField").toggle(2500);
  });
});

  // päivittää sivun
function home() {
  location.reload();
}


// ---------------------------------------------------------------------------------------------------------------------------------------------------------//
//                               ENSIMMÄINEN KUTSU                                                                                                          //
// ---------------------------------------------------------------------------------------------------------------------------------------------------------//


var ekaKutsu, salama, xmlDoc;
var url = "https://www.finnkino.fi/xml/TheatreAreas/"; // osoite josta haetaan xml-tietoa

// aletaan kutsua xml-tietoa
ekaKutsu = new XMLHttpRequest();
ekaKutsu.open("GET", url, true);
ekaKutsu.send();

ekaKutsu.onreadystatechange = function() {
  if (ekaKutsu.readyState == 4 && ekaKutsu.status == 200) {
    xmlDoc = ekaKutsu.responseXML;
    salama = xmlDoc.getElementsByTagName("TheatreArea");

    //  luodaan taulukko, jonne tulostetaan halutut arvot
    taulukko = "<tr><th> Movie theaters </th></th>";

    // käydään läpi kaikki leffateatterit ID-tunnuksien mukaan
    for (i = 2; i < salama.length; i = i + 1) {
      var id = salama[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
      taulukko += "<tr onclick='show(" + id + ")'><td>";
      // lisätään elokuvateatterit nimen mukaan taulukkoon
      taulukko = taulukko + salama[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
    }
    // luodaan taulukko "theaters"-osioon
    document.getElementById("theaters").innerHTML = taulukko;
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------//
//                                          TOINEN KUTSU                                                                                                    //
// ---------------------------------------------------------------------------------------------------------------------------------------------------------//

//  Kun listaa klikkaa
function show(i) {
  $("#textField").show(2500);
  document.getElementById('textField').innerHTML = "";

  //  Aletaan kutsua toista xml-tiedostoa, Title ja EventLargeImagePortrait
  var tokaKutsu = new XMLHttpRequest();
  var url2 = "https://www.finnkino.fi/xml/Schedule/?area=" + i;
  var tulos = document.getElementById('textField');
  var xmlDoc, ukkonen;

  tokaKutsu.open("GET", url2, true);
  tokaKutsu.send();

  tokaKutsu.onreadystatechange = function() {
    if (tokaKutsu.readyState == 4 && tokaKutsu.status == 200) {

      xmlDoc = tokaKutsu.responseXML;
      // Luodaan muuttuja, joka etsii Show-tägin
      ukkonen = xmlDoc.getElementsByTagName("Show");

      for (iitu = 0; iitu < ukkonen.length; iitu = iitu + 1) {

        // Luodaan muuttuja 'image', jossa on EventSmallImagePortrait
        var image = ukkonen[iitu].getElementsByTagName("EventSmallImagePortrait");
        var bbbb = image[0];

        // luodaan muuttuja, jossa on linkki kuvaan
        var linkki = bbbb.childNodes[0].nodeValue;
        var kuva = '<img src="' + linkki + '">';

        // luodaan seuraavaksi useampi muuttuja ja poimitaan haluttuja arvoja
        var imageText = ukkonen[iitu].getElementsByTagName("dttmShowStart"); //
        var dddd = imageText[0]; //
        imageText = dddd.childNodes[0].nodeValue;

        var name = ukkonen[iitu].getElementsByTagName("Title");
        var eeee = name[0];
        name = eeee.childNodes[0].nodeValue;

        var genre = ukkonen[iitu].getElementsByTagName("Genres");
        var ffff = genre[0];
        genre = ffff.childNodes[0].nodeValue;

        var duration = ukkonen[iitu].getElementsByTagName("LengthInMinutes");
        var gggg = duration[0];
        duration = gggg.childNodes[0].nodeValue;

        var where = ukkonen[iitu].getElementsByTagName("TheatreAndAuditorium");
        var hhhh = where[0];
        where = hhhh.childNodes[0].nodeValue;

        var showUrl = ukkonen[iitu].getElementsByTagName("ShowURL");
        var iiii = showUrl[0];
        showUrl = iiii.childNodes[0].nodeValue;
        var jes = '<a href="' + showUrl + '">' + "Click here to book the tickets!" + '</a>';

        // muotoillaan "dttmShowStart"-data hieman selkeämmäksi
        var d = Date.parse(imageText);
        var date = new Date(d);
        imageText = date;

        // lisätään vähän tyyliä listalle
        tulos.style.backgroundColor = "#FFF5C3";
        tulos.style.opacity = "0.9";

        // luodaan taulukko ja tulostetaan itse dataa sen sisälle
        tulos.innerHTML += '<table id="content"><td>' +
          kuva + '</td><td>' +
          "<b>Title: </b>" + name + "<br>" +
          "<b>Showtime: </b>" + imageText + "<br>" +
          "<b>Duration: </b>" + duration + " min" + "<br>" +
          "<b>Genre: </b>" + genre + "<br>" +
          "<b>Location: </b>" + where + "<br>" +
          "<b>Reservations: </b>" + jes +
          '</table></td>';
      }

      // luodaan ankkuri takaisin ylös (ei ole mielekästä scrollata)
      tulos.innerHTML += "<br>" + '<p style="font-size:30px;"><a href="#kokonaisuus">Back To Top &#x21e7; </a></p>';
    }
  }
}
