const Baza = require("./baza.js");

class KorisnikDAO {
	constructor() {
		this.baza = new Baza("RWA2023djosipovi21.sqlite");
	}

	dajSve = async () => {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	};

	daj = async (korime) => {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1) return podaci[0];
		else return null;
	};

	dajEmail = async (email) => {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE email=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [email]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1) return podaci[0];
		else return null;
	};

	dodaj = async (korisnik) => {
		let sql =
			"INSERT INTO korisnik (korime, email, lozinka, ime, prezime, drzava, mjesto, opis, admin, twofa, prviput) VALUES (?,?,?,?,?,?,?,?,?,?,?);";
		let podaci = [
			korisnik.korime,
			korisnik.email,
			korisnik.lozinka,
			korisnik.ime,
			korisnik.prezime,
			korisnik.drzava,
			korisnik.mjesto,
			korisnik.opis,
			korisnik.admin,
			0,
			0,
		];
		this.baza.spojiSeNaBazu();
		await this.baza.izvrsiUpit(sql, podaci);
		this.baza.zatvoriVezu();
		return true;
	};

	obrisi = async (korime) => {
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		return true;
	};

	azuriraj = async (korime, korisnik) => {
		let sql =
			korisnik.lozinka != null
				? "UPDATE korisnik SET lozinka=?, ime=?, prezime=?, drzava=?, mjesto=?, opis=?, twofa=?, tajnikljuc=?, prviput=? WHERE korime=?"
				: "UPDATE korisnik SET ime=?, prezime=?, drzava=?, mjesto=?, opis=?, twofa=?, tajnikljuc=?, prviput=? WHERE korime=?";
		let podaci = [
			korisnik.ime,
			korisnik.prezime,
			korisnik.drzava,
			korisnik.mjesto,
			korisnik.opis,
			korisnik.twofa,
			korisnik.tajnikljuc,
			korisnik.prviput,
			korime,
		];
		if (korisnik.lozinka != null) podaci.unshift(korisnik.lozinka);
		this.baza.spojiSeNaBazu();
		await this.baza.izvrsiUpit(sql, podaci);
		this.baza.zatvoriVezu();
		return true;
	};
}

module.exports = KorisnikDAO;
