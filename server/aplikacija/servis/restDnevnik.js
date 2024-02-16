class RestDnevnik {
	getDnevnik = (zahtjev, odgovor) => {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};
	postDnevnik = (zahtjev, odgovor) => {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};
	putDnevnik = (zahtjev, odgovor) => {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};
	deleteDnevnik = (zahtjev, odgovor) => {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};
}

module.exports = RestDnevnik;
