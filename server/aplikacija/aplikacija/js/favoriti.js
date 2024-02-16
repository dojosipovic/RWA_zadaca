let poruka = document.getElementById("poruka");
let glavna = document.getElementById("sadrzaj");

window.addEventListener("load", async () => {
	dohvatiFavorite();
});

async function dohvatiFavorite() {
	poruka = document.getElementById("poruka");

	let zaglavlje = new Headers();
	zaglavlje.set("Content-Type", "application/json");

	let parametri = { method: "GET", headers: zaglavlje };
	parametri = await dodajToken(parametri);
	let odgovor = await fetch(`${url}:${portRest}/baza/favoriti`, parametri);
	console.log(odgovor.status);
	let tekst = await odgovor.text();

	if (odgovor.status != 200) poruka.innerHTML = JSON.parse(tekst).opis;
	else {
		let favoriti = JSON.parse(tekst);
		console.log(favoriti);
		prikaziFavorite(favoriti);
	}
}

function prikaziFavorite(serije) {
	glavna = document.getElementById("sadrzaj");
	let tablica = "<table border=1>";
	tablica +=
		"<tr><th>Naziv</th><th>Opis</th><th>Slika</th><th>Radnje</th></tr>";
	for (let s in serije) {
		tablica += "<tr>";
		tablica += "<td>" + serije[s].naziv + "</td>";
		tablica += "<td>" + serije[s].opis + "</td>";
		tablica +=
			"<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
			serije[s].slika +
			"' width='100' alt='slika_" +
			serije[s].naziv +
			"'/></td>";
		tablica +=
			"<td><button onClick='ukloniFavorit(" +
			serije[s].tmdb_id +
			")'>Ukloni</button><button onClick='favoritDetalji(" +
			serije[s].tmdb_id +
			")'>Detalji</button></td>";
		tablica += "</tr>";
	}
	tablica += "</table>";

	glavna.innerHTML = tablica;
}

function favoritDetalji(id) {
	window.location.href = `${url}:${portRest}/favoritDetalji?id=${id}`;
}

async function ukloniFavorit(id) {
	console.log("trebam ukloniti " + id);
	poruka = document.getElementById("poruka");

	let zaglavlje = new Headers();
	zaglavlje.set("Content-Type", "application/json");

	let parametri = { method: "DELETE", headers: zaglavlje };
	parametri = await dodajToken(parametri);
	let odgovor = await fetch(`${url}:${portRest}/baza/favorit/${id}`, parametri);
	console.log(odgovor.status);
	let tekst = await odgovor.text();

	poruka.innerHTML = JSON.parse(tekst).opis;
	if (odgovor.status == 201) dohvatiFavorite();
}
