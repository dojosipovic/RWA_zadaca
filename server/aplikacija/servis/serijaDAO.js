const Baza = require("./baza.js");

class SerijaDAO {
	constructor() {
		this.baza = new Baza("RWA2023djosipovi21.sqlite");
	}

	dajSezone = async (id) => {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM sezona WHERE serija_tmdb_id=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		return podaci;
	};

	provjeriFavorit = async (korime, id) => {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM favoriti WHERE korime=? AND tmdb_id_serije=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime, id]);
		this.baza.zatvoriVezu();
		return podaci;
	};

	dajFavorite = async (korime) => {
		this.baza.spojiSeNaBazu();
		let sql =
			"SELECT * FROM serija as s, favoriti as f WHERE f.korime=? AND f.tmdb_id_serije=s.tmdb_id;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		return podaci;
	};

	obrisiFavorite = async (korime) => {
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM favoriti WHERE korime=?;";
		await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		return true;
	};

	dodajFavorit = async (korime, id) => {
		this.baza.spojiSeNaBazu();
		let sql = "INSERT INTO favoriti VALUES(?,?)";
		await this.baza.izvrsiUpit(sql, [korime, id]);
		this.baza.zatvoriVezu();
		return true;
	};

	ukloniFavorit = async (korime, id) => {
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM favoriti WHERE korime=? AND tmdb_id_serije=?";
		await this.baza.izvrsiUpit(sql, [korime, id]);
		this.baza.zatvoriVezu();
		return true;
	};

	dajSeriju = async (id) => {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM serija WHERE tmdb_id=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1) return podaci[0];
		else return null;
	};

	dodajSeriju = async (serija) => {
		let sezone = serija.seasons;
		let sqlSerija = "INSERT INTO serija VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);";
		let sqlSezona = "INSERT INTO sezona VALUES (?,?,?,?,?,?,?,?);";
		let podaciSerije = [
			serija.id,
			serija.name ?? "nema naziva",
			serija.overview,
			serija.number_of_seasons,
			serija.number_of_episodes,
			serija.popularity,
			serija.poster_path ?? "nema slike",
			serija.homepage,
			serija.original_name,
			serija.genres[0]?.name ?? "",
			serija.vote_average,
			serija.vote_count,
			serija.original_language,
		];

		this.baza.spojiSeNaBazu();
		await this.baza.izvrsiUpit(sqlSerija, podaciSerije);
		for (let s of sezone) {
			let podaciSezone = [
				s.id,
				s.name,
				s.overview,
				s.poster_path ?? "",
				s.season_number,
				s.episode_count,
				s.vote_average,
				serija.id,
			];
			console.log("dodajem sezonu " + podaciSezone[0]);
			await this.baza.izvrsiUpit(sqlSezona, podaciSezone);
		}
		this.baza.zatvoriVezu();

		return true;
	};
}

module.exports = SerijaDAO;
