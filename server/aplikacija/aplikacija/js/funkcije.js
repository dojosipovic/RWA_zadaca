const url = "http://localhost";
const portRest = 12000;

async function dodajToken(parametri = {}) {
	let zaglavlje = new Headers();

	if (parametri.headers != null) zaglavlje = parametri.headers;

	let token = await dajToken();
	zaglavlje.set("Authorization", token);
	parametri.headers = zaglavlje;
	console.log(parametri);
	return parametri;
}

async function dajToken() {
	let odgovor = await fetch(`${url}:${portRest}/getJWT`);
	let tekst = JSON.parse(await odgovor.text());
	if (tekst.opis != null) return tekst.opis;
	else return "0000";
}

function prikaziStranicenje(str, ukupno, funkcijaZaDohvat) {
	let prikaz = document.getElementById("stranicenje");
	html = "";
	str = parseInt(str);
	if (str > 1) {
		html = '<button onClick="' + funkcijaZaDohvat + '(1)"><<</button>';
		html +=
			'<button onClick="' +
			funkcijaZaDohvat +
			"(" +
			(str - 1) +
			')"><</button>';
	}
	html +=
		'<button onClick="' +
		funkcijaZaDohvat +
		"(" +
		str +
		')">' +
		str +
		"/" +
		ukupno +
		"</button>";
	if (str < ukupno) {
		html +=
			'<button onClick="' +
			funkcijaZaDohvat +
			"(" +
			(str + 1) +
			')">></button>';
		html +=
			'<button onClick="' + funkcijaZaDohvat + "(" + ukupno + ')">>></button>';
	}
	prikaz.innerHTML = html;
}
