let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const id = urlParams.get("id");
	console.log(id);
	dajFavorit(id);
});

async function dajFavorit(id) {
	poruka = document.getElementById("poruka");
	let zaglavlje = new Headers();
	zaglavlje.set("Content-Type", "application/json");
	let parametri = {
		method: "GET",
		headers: zaglavlje,
	};
	parametri = await dodajToken(parametri);
	let odgovor = await fetch(`${url}:${portRest}/baza/favorit/${id}`, parametri);
	let tekst = await odgovor.text();
	let opis = JSON.parse(tekst);
	console.log(odgovor.status);

	if (odgovor.status != 200) poruka.innerHTML = opis.opis;
	else {
		prikaziPodatke(opis);
	}
}

function prikaziPodatke(serija) {
	const main = document.getElementsByTagName("main")[0];
	console.log(serija);
	let serijaHtml = prikaziSeriju(serija);
	let sezoneHtml = prikaziSezone(serija.sezone);
	main.innerHTML =
		"<h3>Serija</h3>" + serijaHtml + "<h4>Sezone</h4>" + sezoneHtml;
}

function prikaziSeriju(serija) {
	let tablica = "<table border=1>";
	tablica +=
		"<tr><th>ID</th><th>Naziv</th><th>Org. naziv</th><th>Opis</th><th>Tip</th><th>Jezik</th><th>Broj sezona</th><th>Broj epizoda</th><th>Popularnost</th><th>Poster</th><th>Ocjena</th><th>Broj glasova</th></tr>";
	tablica += "<tr>";
	tablica += "<td>" + serija.tmdb_id + "</td>";
	tablica +=
		"<td><a href=" + serija.stranica + ">" + serija.naziv + "</a></td>";
	tablica += "<td>" + serija.originalno_ime + "</td>";
	tablica += "<td>" + serija.opis + "</td>";
	tablica += "<td>" + serija.tip + "</td>";
	tablica += "<td>" + serija.originalni_jezik + "</td>";
	tablica += "<td>" + serija.br_sezona + "</td>";
	tablica += "<td>" + serija.br_epizoda + "</td>";
	tablica += "<td>" + serija.popularnost + "</td>";
	tablica +=
		"<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
		serija.slika +
		"' width='100' alt='slika_" +
		serija.naziv +
		"'/></td>";
	tablica += "<td>" + serija.prosjecno_glasovi + "</td>";
	tablica += "<td>" + serija.broj_glasova + "</td>";

	tablica += "</tr>";
	tablica += "</table>";

	return tablica;
}

function prikaziSezone(sezone) {
	let tablica = "<table border=1>";
	tablica +=
		"<tr><th>ID</th><th>ID serije</th><th>Br. sezone</th><th>Br. epizoda</th><th>Naziv</th><th>Opis</th><th>Poster</th><th>Ocjena</th></tr>";
	for (let s of sezone) {
		console.log(s);
		tablica += "<tr>";
		tablica += "<td>" + s.tmdb_id + "</td>";
		tablica += "<td>" + s.serija_tmdb_id + "</td>";
		tablica += "<td>" + s.br_sezone + "</td>";
		tablica += "<td>" + s.br_epizoda + "</td>";
		tablica += "<td>" + s.naziv + "</td>";
		tablica += "<td>" + s.opis + "</td>";
		tablica +=
			"<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
			s.slika +
			"' width='100' alt='slika_" +
			s.naziv +
			"'/></td>";
		tablica += "<td>" + s.prosjecno_glasovi + "</td>";

		tablica += "</tr>";
	}
	tablica += "</table>";

	return tablica;
}
