const ds = require("fs/promises");

class Konfiguracija {
	constructor() {
		this.konf = {};
	}

	dajKonf() {
		return this.konf;
	}

	async ucitajKonfiguraciju() {
		console.log(this.konf);
		let podaci;
		try {
			podaci = await ds.readFile(process.argv[2], "UTF-8");
		} catch {
			throw "Navedena konfiguracijska datoteka ne postoji!";
		}
		this.konf = pretvoriJSONkonfig(podaci);
		console.log(this.konf);
	}
}

function pretvoriJSONkonfig(podaci) {
	// console.log(podaci);
	let konfPodaci = [
		"jwtValjanost",
		"jwtTajniKljuc",
		"tajniKljucSesija",
		"appStranicenje",
		"tmdbApiKeyV3",
		"tmdbApiKeyV4",
		"tajniKljucCaptcha",
	];
	let konf = {};
	var nizPodataka = podaci.split("\n");
	for (let podatak of nizPodataka) {
		var podatakNiz = podatak.trim().split(":");
		var naziv = podatakNiz[0];
		var vrijednost = podatakNiz[1];
		konfPodaci = konfPodaci.filter((x) => x !== naziv);
		provjeriPostojanjePodatka(naziv, vrijednost);
		provjeriVrijednostPodatka(naziv, vrijednost);
		konf[naziv] = vrijednost;
	}

	if (konfPodaci.length != 0) throw `Nedostaju podaci ${konfPodaci.join(", ")}`;

	return konf;
}

function provjeriPostojanjePodatka(naziv, vrijednost) {
	if (vrijednost == "") throw `${naziv} nema upisanu vrijednost`;
}

function provjeriVrijednostPodatka(naziv, vrijednost) {
	switch (naziv) {
		case "jwtValjanost": {
			const regex = new RegExp("^[0-9]+$");
			if (!regex.test(vrijednost))
				throw `${naziv} mora sadržavati samo brojčane vrijednosti`;
			let broj = parseInt(vrijednost);
			if (broj < 15 || broj > 3600)
				throw `${naziv} mora biti u rasponu 15 - 3600`;
			break;
		}
		case "jwtTajniKljuc":
		case "tajniKljucSesija": {
			const regex = new RegExp("^[A-ž0-9]{50,100}$");
			if (!regex.test(vrijednost))
				throw `${naziv} mora sadržavati kombinaciju slova i brojki dugu 50-100 znakova`;
			break;
		}
		case "appStranicenje": {
			const regex = new RegExp("^[0-9]+$");
			if (!regex.test(vrijednost))
				throw `${naziv} mora sadržavati samo brojčane vrijednosti`;
			let broj = parseInt(vrijednost);
			if (broj < 5 || broj > 100) throw `${naziv} mora biti u rasponu 5 - 100`;
			break;
		}
	}
}

module.exports = Konfiguracija;
