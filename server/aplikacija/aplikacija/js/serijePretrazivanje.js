let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
	//dajSerije(1);
	let filter = document.getElementById("filter");
	filter.addEventListener("keyup", (event) => {
		if (filter.value.length > 2) {
			dajSerije(1);
		} else {
			document.getElementById("sadrzaj").innerHTML = "";
			document.getElementById("stranicenje").innerHTML = "";
		}
	});
});

async function dajSerije(str) {
	let parametri = { method: "POST" };
	parametri = await dodajToken(parametri);
	let odgovor = await fetch(
		`${url}:${portRest}/?str=` + str + "&filter=" + dajFilter(),
		parametri
	);
	if (odgovor.status == 200) {
		let podaci = await odgovor.text();
		podaci = JSON.parse(podaci);
		prikaziSerije(podaci.results);
		prikaziStranicenje(podaci.page, podaci.total_pages, "dajSerije");
	} else if (odgovor.status == 401) {
		document.getElementById("sadrzaj").innerHTML = "";
		poruka.innerHTML = "Neautorizirani pristup! Prijavite se!";
	} else {
		poruka.innerHTML = "Greška u dohvatu serija!";
	}
}

function prikaziSerije(serije) {
	let glavna = document.getElementById("sadrzaj");
	let tablica = "<table border=1>";
	tablica +=
		"<tr><th>Naziv</th><th>Opis</th><th>Slika</th><th>Radnje</th></tr>";
	for (let s of serije) {
		tablica += "<tr>";
		tablica += "<td>" + s.name + "</td>";
		tablica += "<td>" + s.overview + "</td>";
		tablica +=
			"<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
			s.poster_path +
			"' width='100' alt='slika_" +
			s.title +
			"'/></td>";
		tablica +=
			"<td><button onClick='prikaziDetalje(" +
			s.id +
			")'>Detalji</button></td>";
		tablica += "</tr>";
	}
	tablica += "</table>";

	sessionStorage.dohvaceneSerije = JSON.stringify(serije);

	glavna.innerHTML = tablica;
}

async function prikaziDetalje(idSerije) {
	let putanja = `/detaljiSerije?id=${idSerije}`;
	console.log(putanja);
	window.location.href = putanja;
}

function dajFilter() {
	return document.getElementById("filter").value;
}
