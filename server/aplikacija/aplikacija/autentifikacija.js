const mail = require("./moduli/mail.js");
const kodovi = require("./moduli/kodovi.js");
const portRest = 12000;
const url = "http://localhost";

async function dodajToken(parametri = {}) {
	let zaglavlje = new Headers();

	if (parametri.headers != null) zaglavlje = parametri.headers;

	let token = await dajToken();
	zaglavlje.set("Authorization", token);
	parametri.headers = zaglavlje;
	console.log(parametri);
	return parametri;
}

async function dajToken() {
	let odgovor = await fetch(`${url}:${portRest}/getJWT`);
	let tekst = JSON.parse(await odgovor.text());
	console.log(tekst);
	console.log("tekst = " + tekst.body);
	if (tekst.opis != null) return tekst.opis;
	else return "0000";
}

class Autentifikacija {
	async dodajKorisnika(zahtjev) {
		let korisnik = zahtjev.body;
		let tijelo = {
			ime: korisnik.ime,
			prezime: korisnik.prezime,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, korisnik.ime),
			email: korisnik.email,
			korime: korisnik.korime,
			drzava: korisnik.drzava,
			mjesto: korisnik.mjesto,
			opis: korisnik.opis,
			admin: 0,
		};

		let zaglavlje = new Headers();
		//zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			//headers: zaglavlje,
		};
		parametri = await dodajToken(parametri);
		console.log("session.jwt=" + zahtjev.session.jwt);
		let odgovor = await fetch(`${url}:${portRest}/baza/korisnici`, parametri);

		if (odgovor.status == 201) {
			console.log("Korisnik ubačen na servisu");
			let mailPoruka = `Poštovani,
				vaši podaci za prijavu su sljedeći:
				Korisničko ime:${korisnik.korime}
				Lozinka: ${korisnik.lozinka}
				Lijep pozdrav,
				Administrator sustava`;
			// try {
			// 	let poruka = await mail.posaljiMail(
			// 		"dominik.josipovic@gmail.com",
			// 		korisnik.email,
			// 		"Podaci za prijavu",
			// 		mailPoruka
			// 	);
			// } catch {
			// 	console.log(`Greska prilikom slanja emaila: ${korisnik.email}`);
			// }
		}

		// ----------------------------------
		return odgovor;
	}

	async prijaviKorisnika(korime, lozinka) {
		let tijelo = {
			lozinka: lozinka,
		};
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			`${url}:${portRest}/baza/korisnici/${korime}/prijava`,
			parametri
		);

		if (odgovor.status == 200) {
			let poruka = await odgovor.text();
			return poruka;
		} else {
			return false;
		}
	}
}

module.exports = Autentifikacija;
