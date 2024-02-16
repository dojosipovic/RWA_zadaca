const SerijePretrazivanje = require("./serijePretrazivanje.js");
const jwt = require("./moduli/jwt.js");
const Autentifikacija = require("./autentifikacija.js");

class FetchUpravitelj {
	constructor(tajniKljucJWT, jwtValjanost) {
		this.auth = new Autentifikacija();
		this.sp = new SerijePretrazivanje();
		this.tajniKljucJWT = tajniKljucJWT;
		this.jwtValjanost = jwtValjanost;
	}

	getJWT = async function (zahtjev, odgovor) {
		odgovor.type("json");
		console.log("zahtjev.session.jwt " + zahtjev.session.jwt);
		if (zahtjev.session.jwt != null) {
			let k = {
				korime: jwt.dajTijelo(zahtjev.session.jwt).korime,
				admin: jwt.dajTijelo(zahtjev.session.jwt).admin,
			};
			let noviToken = jwt.kreirajToken(
				k,
				this.tajniKljucJWT,
				this.jwtValjanost
			);
			odgovor.status(200);
			odgovor.send({ opis: noviToken });
			return;
		}
		odgovor.status(401);
		odgovor.send({ opis: "zabranjen pristup" });
	};

	getJwtTijelo = async function (zahtjev, odgovor) {
		odgovor.type("json");
		if (zahtjev.session.jwt != null) {
			let k = {
				korime: jwt.dajTijelo(zahtjev.session.jwt).korime,
				admin: jwt.dajTijelo(zahtjev.session.jwt).admin,
			};
			let noviToken = jwt.kreirajToken(
				k,
				this.tajniKljucJWT,
				this.jwtValjanost
			);
			let tijelo = jwt.dajTijelo(noviToken);
			odgovor.status(200);
			odgovor.send({ opis: tijelo });
			return;
		}
		odgovor.status(401);
		odgovor.send({ opis: "potrebna prijava" });
	};

	pocetna = async function (zahtjev, odgovor) {
		let str = zahtjev.query.str;
		let filter = zahtjev.query.filter;
		console.log(zahtjev.query);
		odgovor.json(await this.sp.dohvatiSerije(str, filter));
	};
}
module.exports = FetchUpravitelj;
