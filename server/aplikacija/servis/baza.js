const SQLite = require("sqlite3").Database;

class Baza {
	constructor(putanjaSQLliteDatoteka) {
		this.vezaDB = new SQLite(putanjaSQLliteDatoteka);
		this.putanjaSQLliteDatoteka = putanjaSQLliteDatoteka;
		this.vezaDB.exec("PRAGMA foreign_keys = ON;");
	}

	spojiSeNaBazu() {
		this.vezaDB = new SQLite(this.putanjaSQLliteDatoteka);
		this.vezaDB.exec("PRAGMA foreign_keys = ON;");
	}

	izvrsiUpit(sql, podaciZaSQL, povratnaFunkcija) {
		this.vezaDB.exec(sql, podaciZaSQL, povratnaFunkcija);
	}

	izvrsiUpit(sql, podaciZaSQL) {
		return new Promise((uspjeh, neuspjeh) => {
			this.vezaDB.all(sql, podaciZaSQL, (greska, rezultat) => {
				if (greska) neuspjeh(greska);
				else uspjeh(rezultat);
			});
		});
	}

	zatvoriVezu() {
		this.vezaDB.close();
	}
}

module.exports = Baza;
