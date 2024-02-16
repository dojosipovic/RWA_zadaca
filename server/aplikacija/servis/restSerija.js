const SerijaDAO = require("./serijaDAO.js");
const jwt = require("../aplikacija/moduli/jwt.js");
const kodovi = require("../aplikacija/moduli/kodovi.js");

const url = "http://localhost";
const portRest = 12000;

class RestKorisnik {
	constructor(tajniKljucJWT) {
		this.sdao = new SerijaDAO();
		this.tajniKljucJWT = tajniKljucJWT;
	}

	postFavoriti = async function (zahtjev, odgovor) {
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ opis: "potrebna prijava" });
			return;
		}
		let token = zahtjev.headers.authorization;
		let korime = jwt.dajTijelo(token).korime;

		let id = zahtjev.body.serijaId;
		if (id == undefined || id == null || id == "") {
			odgovor.status(417);
			odgovor.send(JSON.stringify({ opis: "neočekivani podaci" }));
			return;
		}

		let dohvat = await fetch(`${url}:${portRest}/api/tmdb/serija?id=` + id);
		if (dohvat.status != 200) {
			odgovor.status(417);
			odgovor.send(JSON.stringify({ opis: "neočekivani podaci" }));
			return;
		}
		let podaci = await dohvat.text();
		let serija = JSON.parse(podaci);

		let favorit = await this.sdao
			.provjeriFavorit(korime, serija.id)
			.then((favoriti) => favoriti);

		if (favorit.length != 0) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "već imate taj favorit" }));
			return;
		}

		let serijaDB = await this.sdao.dajSeriju(serija.id);
		if (serijaDB == null) {
			await this.sdao.dodajSeriju(serija).then((odgovor) => odgovor);
		}

		let dodavanje = true;
		await this.sdao.dodajFavorit(korime, serija.id).catch(() => {
			dodavanje = false;
		});

		console.log(dodavanje);

		if (dodavanje == false) {
			odgovor.status(400);
			odgovor.send(
				JSON.stringify({ opis: "greška prilkom dodavanja favorita" })
			);
			return;
		}

		odgovor.status(201);
		odgovor.send(JSON.stringify({ opis: "izvršeno" }));
	};

	getFavoriti = async function (zahtjev, odgovor) {
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.send({ opis: "potrebna prijava" });
			return;
		}
		let token = zahtjev.headers.authorization;
		let korime = jwt.dajTijelo(token).korime;

		let favoriti = await this.sdao.dajFavorite(korime).then((serije) => serije);
		if (favoriti.length == 0) {
			odgovor.status(400);
			odgovor.send({ opis: "nemate favorita" });
			return;
		}

		let opis = favoriti;
		console.log(opis);

		odgovor.status(200);
		odgovor.send(JSON.stringify(opis));
	};

	putFavoriti = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	deleteFavoriti = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	postFavorit = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { opis: "zabranjeno" };
		odgovor.send(JSON.stringify(poruka));
	};

	putFavorit = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { opis: "zabranjeno" };
		odgovor.send(JSON.stringify(poruka));
	};

	deleteFavorit = async function (zahtjev, odgovor) {
		odgovor.type("application/json");
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.send({ opis: "potrebna prijava" });
			return;
		}
		let id = zahtjev.params.id;
		let token = zahtjev.headers.authorization;
		let korime = jwt.dajTijelo(token).korime;

		let favoriti = await this.sdao.provjeriFavorit(korime, id);
		if (favoriti.length == 0) {
			odgovor.status(400);
			odgovor.send({ opis: "serija se ne nalazi u favoritima" });
			return;
		}

		let ukloni = true;
		await this.sdao.ukloniFavorit(korime, id).catch(() => (ukloni = false));
		if (ukloni == false) {
			odgovor.status(400);
			odgovor.send({ opis: "greška prilikom brisanja favorita" });
			return;
		}

		odgovor.status(201);
		odgovor.send({ opis: "izvršeno" });
	};

	getFavorit = async function (zahtjev, odgovor) {
		odgovor.type("application/json");
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.send({ opis: "potrebna prijava" });
			return;
		}
		let token = zahtjev.headers.authorization;
		let korime = jwt.dajTijelo(token).korime;
		let id = zahtjev.params.id;
		let favorit = await this.sdao
			.provjeriFavorit(korime, id)
			.then((podaci) => podaci);
		if (favorit == 0) {
			odgovor.status(400);
			odgovor.send({ opis: "nemate tog favorita" });
			return;
		}

		let serija = await this.sdao.dajSeriju(id).then((s) => s);
		let sezone = await this.sdao.dajSezone(id).then((s) => s);
		serija.sezone = sezone;

		odgovor.status(200);
		odgovor.send(JSON.stringify(serija));
	};
}

module.exports = RestKorisnik;
