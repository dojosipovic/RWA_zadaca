let forma = document.getElementById("profil");
let poruka = document.getElementById("poruka");
let korisnik = null;

window.addEventListener("load", () => {
	forma = document.getElementById("profil");
	poruka = document.getElementById("poruka");

	forma.hidden = true;
	forma.addEventListener("submit", async (e) => {
		e.preventDefault();
		const podaci = new FormData(forma);
		let podaciOKorisniku = {};
		for (const [name, value] of podaci) {
			podaciOKorisniku[name] = value;
		}
		podaciOKorisniku.admin = korisnik.admin;
		podaciOKorisniku.email = korisnik.email;
		podaciOKorisniku.korime = korisnik.korime;

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		console.log(podaciOKorisniku);

		let parametri = {
			method: "PUT",
			body: JSON.stringify(podaciOKorisniku),
			headers: zaglavlje,
		};

		parametri = await dodajToken(parametri);
		let odgovor = await fetch(
			`${url}:${portRest}/baza/korisnici/` + korisnik.korime,
			parametri
		);

		poruka.innerHTML = JSON.parse(await odgovor.text()).opis;
		console.log(odgovor.status);
	});

	obradiPrikaz();
});

async function obradiPrikaz() {
	korisnik = await dohvatiPodatke();
	console.log(korisnik);
	prikaziPodatke(korisnik);
	forma.hidden = false;
}

function prikaziPodatke(podaci) {
	document.getElementById("ime").value = podaci.ime;
	document.getElementById("prezime").value = podaci.prezime;
	document.getElementById("drzava").value = podaci.drzava;
	document.getElementById("mjesto").value = podaci.mjesto;
	document.getElementById("opis").value = podaci.opis;

	document.getElementById("korime").value = podaci.korime;
	document.getElementById("korime").disabled = true;
	console.log(document.getElementById("korime").value);

	document.getElementById("email").value = podaci.email;
	document.getElementById("email").disabled = true;
}

async function dohvatiPodatke() {
	let odgovor = await fetch(`${url}:${portRest}/getJwtTijelo`);
	let tekst = await odgovor.text();
	let ispis = JSON.parse(tekst).opis;

	if (odgovor.status == 401) {
		poruka.innerHTML = ispis;
		return NULL;
	}

	let korime = JSON.parse(tekst).opis.korime;

	let parametri = { method: "GET" };
	parametri = await dodajToken(parametri);
	let korisnikOdgovor = await fetch(
		`${url}:${portRest}/baza/korisnici/` + korime,
		parametri
	);
	tekst = await korisnikOdgovor.text();

	return JSON.parse(tekst);
}
