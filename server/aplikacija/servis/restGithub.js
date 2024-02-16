const client_id = "97fbfe9d4dfe0ff5a416";
const githubTajniKljuc = "891ef5ac7cb958ba0d8222708c1c06a9bad19f3c";
const povratniURL = "http://localhost:12000/githubPovratno";

dajAccessToken = async function (dobiveniKod) {
	let parametri = {
		method: "POST",
		headers: { Accept: "application/json" },
	};
	let urlParametri = `?client_id=${client_id}&client_secret=${githubTajniKljuc}&code=${dobiveniKod}`;
	let o = await fetch(
		"https://github.com/login/oauth/access_token" + urlParametri,
		parametri
	);
	let podaci = await o.text();
	console.log(podaci);
	return JSON.parse(podaci).access_token;
};

provjeriToken = async function (token) {
	let parametri = {
		method: "GET",
		headers: { Authorization: "Bearer " + token },
	};
	let o = await fetch("https://api.github.com/user", parametri);
	let podaci = await o.text();
	return podaci;
};

exports.githubPrijava = function (zahtjev, odgovor) {
	let url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${povratniURL}`;
	odgovor.redirect(url);
};

exports.githubOdjava = function (zahtjev, odgovor) {
	zahtjev.session.github = "";
	odgovor.status(201);
	odgovor.send(JSON.stringify({ opis: "Izvršeno" }));
};

exports.githubPovratno = async function (zahtjev, odgovor) {
	console.log(zahtjev.query);
	let token = await this.dajAccessToken(zahtjev.query.code);
	console.log(token);
	let podaci = await this.provjeriToken(token);
	console.log(podaci);
	zahtjev.session.github = podaci;
	odgovor.redirect("/");
};

exports.githubPodaci = async function (zahtjev, odgovor) {
	odgovor.status(200);
	odgovor.send(zahtjev.session.github);
};
