const KorisnikDAO = require("./korisnikDAO.js");
const SerijaDAO = require("./serijaDAO.js");
const jwt = require("../aplikacija/moduli/jwt.js");
const kodovi = require("../aplikacija/moduli/kodovi.js");
const totp = require("../aplikacija/moduli/totp.js");
const mail = require("../aplikacija/moduli/mail.js");

class RestKorisnik {
	constructor(tajniKljucJWT, jwtValjanost, tajniKljucCaptcha) {
		this.kdao = new KorisnikDAO();
		this.tajniKljucJWT = tajniKljucJWT;
		this.jwtValjanost = jwtValjanost;
		this.tajniKljucCaptcha = tajniKljucCaptcha;
		this.sdao = new SerijaDAO();
	}

	getKorisnici = async function (zahtjev, odgovor) {
		odgovor.type("application/json");
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ opis: "potrebna prijava" });
			return;
		}
		let token = zahtjev.headers.authorization;
		let admin = jwt.dajTijelo(token).admin;

		if (admin !== 1) {
			odgovor.status(403);
			odgovor.json({ opis: "zabranjen pristup" });
			return;
		}

		console.log(zahtjev.session);
		this.kdao
			.dajSve()
			.then((korisnici) => {
				console.log(korisnici);
				odgovor.status(200);
				odgovor.send(JSON.stringify(korisnici));
			})
			.catch(() => {
				odgovor.status(400);
				odgovor.send({ opis: "greška prilikom dohvaćanje" });
			});
	};

	postKorisnici = async function (zahtjev, odgovor) {
		odgovor.type("application/json");
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ opis: "potrebna prijava" });
			return;
		}
		let tokenJWT = zahtjev.headers.authorization;
		let admin = jwt.dajTijelo(tokenJWT).admin;

		if (admin !== 1) {
			odgovor.status(403);
			odgovor.json({ opis: "zabranjen pristup" });
			return;
		}

		let token = zahtjev.body.token;
		let o = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${this.tajniKljucCaptcha}&response=${token}`,
			{ method: "POST" }
		);

		let recaptchaStatus = JSON.parse(await o.text());
		console.log(recaptchaStatus);
		if (!(recaptchaStatus.success && recaptchaStatus.score > 0.5)) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "Recaptcha robot" }));
			return;
		}

		let podaci = zahtjev.body.korisnik;
		let postojiEmail,
			postojiUser = false;

		if (
			podaci.korime === "" ||
			podaci.korime === undefined ||
			podaci.korime === null
		) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "Korisničko ime je obavezno!" }));
			return;
		}
		if (
			podaci.email === "" ||
			podaci.email === undefined ||
			podaci.email === null
		) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "Email ime je obavezan!" }));
			return;
		}
		if (
			podaci.lozinka === "" ||
			podaci.lozinka === undefined ||
			podaci.lozinka === null
		) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "Lozinka je obavezna!" }));
			return;
		}

		postojiUser =
			(await this.kdao.daj(podaci.korime).then((response) => response)) !==
			null;
		postojiEmail =
			(await this.kdao.dajEmail(podaci.email).then((response) => response)) !==
			null;

		if (postojiUser) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "Korisničko ime već postoji!" }));
			return;
		}

		if (postojiEmail) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "email već postoji!" }));
			return;
		}

		await saljiEmail(podaci);
		podaci.lozinka = kodovi.kreirajSHA256(podaci.lozinka, podaci.korime);

		this.kdao
			.dodaj(podaci)
			.then(() => {
				odgovor.status(201);
				odgovor.send(JSON.stringify({ opis: "izvrseno" }));
			})
			.catch(() => {
				odgovor.status(400);
				odgovor.send(
					JSON.stringify({ opis: "greška prilikom dodavanja korisnika" })
				);
			});
	};

	deleteKorisnici = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	putKorisnici = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	getKorisnik = async function (zahtjev, odgovor) {
		odgovor.type("application/json");
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ opis: "potrebna prijava" });
			return;
		}

		let token = zahtjev.headers.authorization;
		let korimeToken = jwt.dajTijelo(token).korime;
		let korime = zahtjev.params.korime;

		if (korime != korimeToken) {
			odgovor.status(417);
			odgovor.json({ opis: "neočekivani podaci" });
			return;
		}

		let korisnik = await this.kdao.daj(korime);
		if (korisnik == null) {
			odgovor.status(200);
			odgovor.send(JSON.stringify([]));
		}

		if (korisnik.prviput == 1) {
			let updateKorisnik = { ...korisnik };
			updateKorisnik.prviput = 0;
			await this.kdao.azuriraj(korime, updateKorisnik);
		}
		console.log(korisnik);
		odgovor.status(200);
		odgovor.send(JSON.stringify(korisnik));
	};

	getKorisnikPrijava = function (zahtjev, odgovor) {
		odgovor.type("application/json");
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
			odgovor.setHeader("Authorization", noviToken);
			odgovor.status(201);
			odgovor.send(JSON.stringify({ opis: "izvrseno" }));
			return;
		}
		odgovor.status(401);
		odgovor.send({ opis: "zabranjen pristup" });
	};

	postKorisnikPrijava = async function (zahtjev, odgovor) {
		odgovor.type("application/json");
		let korime = zahtjev.params.korime;
		let token = zahtjev.body.token;

		let o = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${this.tajniKljucCaptcha}&response=${token}`,
			{ method: "POST" }
		);

		let recaptchaStatus = JSON.parse(await o.text());
		console.log(recaptchaStatus);

		if (!(recaptchaStatus.success && recaptchaStatus.score > 0.5)) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "Recaptcha robot" }));
			return;
		}

		this.kdao.daj(korime).then((korisnik) => {
			let lozinka = kodovi.kreirajSHA256(zahtjev.body.lozinka, korime);
			let totpToken = zahtjev.body.totp;
			console.log(typeof totpToken);
			if (korisnik.twofa == 1) {
				// if (totpToken == undefined || totpToken == null || totpToken == "") {
				// 	odgovor.status(400);
				// 	odgovor.send(JSON.stringify({ opis: "Neispravan TOTP!" }));
				// 	return;
				// }
				if (!totp.provjeriTOTP(totpToken, korisnik.tajnikljuc)) {
					odgovor.status(400);
					odgovor.send(JSON.stringify({ opis: "Neispravan TOTP!" }));
					return;
				}
			}
			if (korisnik != null && korisnik.lozinka == lozinka) {
				zahtjev.session.jwt = jwt.kreirajToken(
					korisnik,
					this.tajniKljucJWT,
					this.jwtValjanost
				);
				console.log(korisnik.ime + " " + korisnik.prezime);
				zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
				zahtjev.session.korime = korisnik.korime;
				zahtjev.session.admin = korisnik.admin;
				odgovor.status(201);
				odgovor.send(JSON.stringify({ opis: "Izvršeno" }));
			} else {
				odgovor.status(400);
				odgovor.send(JSON.stringify({ opis: "Krivi podaci!" }));
			}
		});
	};

	putKorisnikPrijava = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.status(501);
		odgovor.send(JSON.stringify(poruka));
	};

	deleteKorisnikPrijava = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.status(501);
		odgovor.send(JSON.stringify(poruka));
	};

	postKorisnik = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { opis: "zabranjeno" };
		odgovor.send(JSON.stringify(poruka));
	};

	deleteKorisnik = async function (zahtjev, odgovor) {
		odgovor.type("application/json");

		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ opis: "potrebna prijava" });
			return;
		}
		let token = zahtjev.headers.authorization;
		let admin = jwt.dajTijelo(token).admin;

		if (admin !== 1) {
			odgovor.status(403);
			odgovor.json({ opis: "zabranjen pristup" });
			return;
		}

		let korime = zahtjev.params.korime;
		if (korime == "admin") {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "korisnik je admin" }));
			return;
		}
		await this.sdao.obrisiFavorite(korime).then((odgovor) => odgovor);

		this.kdao.obrisi(korime).then(() => {
			odgovor.status(201);
			odgovor.send(JSON.stringify({ opis: "izvrseno" }));
		});
	};

	putKorisnik = async function (zahtjev, odgovor) {
		odgovor.type("application/json");
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ opis: "potrebna prijava" });
			return;
		}

		let korime = zahtjev.params.korime;
		let podaci = zahtjev.body.korisnik;

		let token = zahtjev.body.token;
		let o = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${this.tajniKljucCaptcha}&response=${token}`,
			{ method: "POST" }
		);

		let recaptchaStatus = JSON.parse(await o.text());
		console.log(recaptchaStatus);
		if (!(recaptchaStatus.success && recaptchaStatus.score > 0.5)) {
			odgovor.status(400);
			odgovor.send(JSON.stringify({ opis: "Recaptcha robot" }));
			return;
		}

		let JWT = zahtjev.headers.authorization;
		let tokenKorime = jwt.dajTijelo(JWT).korime;

		if (korime != tokenKorime) {
			odgovor.status(417);
			odgovor.json({ opis: "Neočekivani podaci" });
			return;
		}

		podaci.lozinka != ""
			? (podaci.lozinka = kodovi.kreirajSHA256(podaci.lozinka, podaci.korime))
			: (podaci.lozinka = null);

		let korisnik = await this.kdao.daj(korime);

		podaci.korime = korisnik.korime;
		podaci.email = korisnik.email;
		podaci.admin = korisnik.admin;
		podaci.prviput = 0;
		podaci.tajnikljuc = korisnik.tajnikljuc;

		if (podaci.twofa == 1 && korisnik.tajnikljuc == null) {
			podaci.tajnikljuc = await totp.kreirajTajniKljuc(podaci.korime);
			podaci.prviput = 1;
		}

		console.log("PODACI APAPAPAPPAPAPAAPAPAPAPAPAAPPs");
		console.log(podaci);

		this.kdao
			.azuriraj(korime, podaci)
			.then(() => {
				odgovor.status(201);
				odgovor.send(JSON.stringify({ opis: "Izvršeno" }));
			})
			.catch(() => {
				odgovor.status(400);
				odgovor.send(
					JSON.stringify({ opis: "Greška prilikom ažuriranja korisnika" })
				);
			});
	};
}

module.exports = RestKorisnik;

async function saljiEmail(korisnik) {
	let mailPoruka = `Poštovani,
				vaši podaci za prijavu su sljedeći:
				Korisničko ime:${korisnik.korime}
				Lozinka: ${korisnik.lozinka}
				Lijep pozdrav,
				Administrator sustava`;
	// try {
	// 	let poruka = await mail.posaljiMail(
	// 		"djosipovi21@foi.hr",
	// 		korisnik.email,
	// 		"Podaci za prijavu",
	// 		mailPoruka
	// 	);
	// } catch {
	// 	console.log(`Greska prilikom slanja emaila: ${korisnik.email}`);
	// }
}
