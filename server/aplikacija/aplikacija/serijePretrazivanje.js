const portRest = 12000;
const url = "http://localhost:" + portRest + "/api";

class SerijeZanroviPretrazivanje {
	async dohvatiSerije(stranica, kljucnaRijec = "") {
		let putanja =
			url + "/tmdb/serije?stranica=" + stranica + "&trazi=" + kljucnaRijec;
		console.log(putanja);
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let serije = JSON.parse(podaci);
		return serije;
	}
}

module.exports = SerijeZanroviPretrazivanje;
