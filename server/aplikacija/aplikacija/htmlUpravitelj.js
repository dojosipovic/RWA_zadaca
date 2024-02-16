const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js");
const Autentifikacija = require("./autentifikacija.js");

class HtmlUpravitelj {
	constructor(tajniKljucJWT, jwtValjanost) {
		this.tajniKljucJWT = tajniKljucJWT;
		this.jwtValjanost = jwtValjanost;
		console.log(this.tajniKljucJWT);
		this.auth = new Autentifikacija();
	}

	pocetna = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		console.log(zahtjev.session);
		let pocetna = await ucitajStranicu("pocetna", uloga);
		odgovor.send(pocetna);
	};

	dokumentacija = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		let dokumentacija = await ucitajStranicu(
			"/../../dokumentacija/dokumentacija",
			uloga
		);
		odgovor.send(dokumentacija);
	};

	registracija = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		let greska = "";
		let stranica = await ucitajStranicu("registracija", uloga, greska);
		odgovor.send(stranica);
	};

	odjava = async function (zahtjev, odgovor) {
		console.log(zahtjev.session);
		zahtjev.session.jwt = null;
		zahtjev.session.admin = undefined;
		odgovor.redirect("/");
	};

	prijava = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "POST") {
			var korime = zahtjev.body.korime;
			var lozinka = zahtjev.body.lozinka;
			var korisnik = await this.auth.prijaviKorisnika(korime, lozinka);
			korisnik = JSON.parse(korisnik);
			if (korisnik) {
				// zahtjev.session.jwt = jwt.kreirajToken(
				// 	korisnik,
				// 	this.tajniKljucJWT,
				// 	this.jwtValjanost
				// );
				// console.log(korisnik.ime + " " + korisnik.prezime);
				// zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
				// zahtjev.session.korime = korisnik.korime;
				// zahtjev.session.admin = korisnik.admin;
				odgovor.redirect("/");
				return;
			} else {
				greska = "Netocni podaci!";
			}
		}

		let uloga = zahtjev.session.admin;
		let stranica = await ucitajStranicu("prijava", uloga, greska);
		odgovor.send(stranica);
	};

	detaljiSerije = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		let stranica = await ucitajStranicu("detaljiSerije", uloga);
		odgovor.send(stranica);
	};

	korisnici = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		let stranica = await ucitajStranicu("korisnici", uloga);
		odgovor.send(stranica);
	};

	profil = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		let stranica = await ucitajStranicu("profil", uloga);
		odgovor.send(stranica);
	};

	favoriti = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		let stranica = await ucitajStranicu("favoriti", uloga);
		odgovor.send(stranica);
	};

	favoritDetalji = async function (zahtjev, odgovor) {
		let uloga = zahtjev.session.admin;
		let stranica = await ucitajStranicu("detaljiFavorit", uloga);
		odgovor.send(stranica);
	};
}

module.exports = HtmlUpravitelj;

async function ucitajStranicu(nazivStranice, uloga, poruka = "") {
	let navigacija =
		uloga == undefined
			? "navigacija"
			: uloga == 1
			? "navigacija-admin"
			: "navigacija-korisnik";
	let stranice = [ucitajHTML(nazivStranice), ucitajHTML(navigacija)];
	let [stranica, nav] = await Promise.all(stranice);
	stranica = stranica.replace("#navigacija#", nav);
	stranica = stranica.replace("#poruka#", poruka);
	return stranica;
}

function ucitajHTML(htmlStranica) {
	return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}
