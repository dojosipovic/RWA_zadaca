let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const id = urlParams.get("id");
	console.log(id);

	dajSeriju(id);
});

async function dajSeriju(id) {
	let odgovor = await fetch(`${url}:${portRest}/api/tmdb/serija?id=${id}`);
	let podaci = await odgovor.text();
	podaci = JSON.parse(podaci);
	console.log(odgovor.status);
	if (odgovor.status == 200) {
		console.log(podaci.success);
		if (podaci.success == false) {
			poruka.innerHTML = "neočekivani podaci";
		} else {
			prikaziSeriju(podaci);
		}
	} else {
		poruka.innerHTML = podaci.opis;
	}
}

function prikaziSeriju(s) {
	const main = document.getElementsByTagName("main")[0];

	let tablica = "<table border=1>";
	tablica +=
		"<tr><th>Naziv</th><th>Opis</th><th>Broj sezona</th><th>Broj epizoda</th><th>Popularnost</th><th>Poster</th><th>Favorit</th></tr>";
	tablica += "<tr>";
	tablica += "<td><a href=" + s.homepage + ">" + s.original_name + "</a></td>";
	tablica += "<td>" + s.overview + "</td>";
	tablica += "<td>" + s.number_of_seasons + "</td>";
	tablica += "<td>" + s.number_of_episodes + "</td>";
	tablica += "<td>" + s.popularity + "</td>";
	tablica +=
		"<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
		s.poster_path +
		"' width='100' alt='slika_" +
		s.title +
		"'/></td>";
	tablica +=
		"<td><button onClick='dodajFavoriti(\"" +
		s.id +
		"\")'>Dodaj u favorite</button></td>";
	tablica += "</tr>";
	tablica += "</table>";

	main.innerHTML = tablica;
}

async function dodajFavoriti(id) {
	let zaglavlje = new Headers();
	zaglavlje.set("Content-Type", "application/json");
	let tijelo = { serijaId: id };
	let parametri = {
		method: "POST",
		body: JSON.stringify(tijelo),
		headers: zaglavlje,
	};
	parametri = await dodajToken(parametri);

	let odgovor = await fetch(`${url}:${portRest}/baza/favoriti`, parametri);
	let podaci = await odgovor.text();
	console.log(odgovor.status);

	poruka.innerHTML = JSON.parse(podaci).opis;
}
