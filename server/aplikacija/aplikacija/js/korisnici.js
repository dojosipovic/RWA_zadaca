let main = document.getElementsByTagName("main")[0];
let ispis = document.getElementById("poruka");

window.addEventListener("load", () => {
	main = document.getElementsByTagName("main")[0];
	ispis = document.getElementById("poruka");
	dohvatiKorisnike();
});

async function dohvatiKorisnike() {
	let parametri = { method: "GET" };
	parametri = await dodajToken(parametri);
	console.log(parametri);
	let odgovor = await fetch(`${url}:${portRest}/baza/korisnici`, parametri);
	console.log(odgovor);
	let poruka = await odgovor.text();

	if (odgovor.status == 401 || odgovor.status == 403) {
		ispis.innerHTML = JSON.parse(poruka).opis;
	}

	if (odgovor.status == 200) {
		let podaci = poruka;
		let korisnici = JSON.parse(podaci);
		console.log(korisnici);
		let tablica = "<table border=1>";
		tablica +=
			"<tr><th>Ime</th><th>Prezime</th><th>Korisničko ime</th><th>Email</th><th>Država</th><th>Admin</th><th>Radnje</th></tr>";

		for (let k of korisnici) {
			tablica += "<tr>";

			tablica += "<td>" + k.ime + "</td>";
			tablica += "<td>" + k.prezime + "</td>";
			tablica += "<td>" + k.korime + "</td>";
			tablica += "<td>" + k.email + "</td>";
			tablica += "<td>" + k.drzava + "</td>";
			tablica += "<td>" + (k.admin != 0 ? "Da" : "Ne") + "</td>";
			tablica +=
				"<td><button onClick='obrisiKorisnika(\"" +
				k.korime +
				"\")'>Obriši</button></td>";

			tablica += "</tr>";
		}

		tablica += "</table>";

		main.innerHTML = tablica;
	} else {
		poruka.innerHTML = "Greška prilikom dohvaćanja korisnika";
	}
}

async function obrisiKorisnika(korime) {
	let parametri = { method: "DELETE" };
	parametri = await dodajToken(parametri);
	let odgovor = await fetch(
		`${url}:${portRest}/baza/korisnici/` + korime,
		parametri
	);

	let tekst = JSON.parse(await odgovor.text()).opis;
	ispis.innerHTML = tekst;
	if (odgovor.status == 201) {
		dohvatiKorisnike();
	}
}
