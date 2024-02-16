const Baza = require("./baza.js");

class DnevnikDAO {
	constructor() {
		this.baza = new Baza("RWA2023djosipovi21.sqlite");
	}

	upisiZapis = async (zahtjev, resurs, tijelo, korime) => {
		this.baza.spojiSeNaBazu();
		let sql =
			"INSERT INTO dnevnik (datum,vrijeme,zahtjev,resurs,tijelo,korime) VALUES (?,?,?,?,?,?)";
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		return podaci;
	};
}

module.exports = DnevnikDAO;
