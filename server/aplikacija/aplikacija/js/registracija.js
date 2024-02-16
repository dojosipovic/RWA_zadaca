let forma = document.getElementById("registracija");
let poruka = document.getElementById("poruka");

window.addEventListener("load", () => {
	forma = document.getElementById("registracija");
	poruka = document.getElementById("poruka");

	forma.addEventListener("submit", async (e) => {
		e.preventDefault();
		const podaci = new FormData(forma);
		let podaciOKorisniku = {};
		for (const [name, value] of podaci) {
			podaciOKorisniku[name] = value;
		}
		podaciOKorisniku.admin = 0;

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(podaciOKorisniku),
			headers: zaglavlje,
		};

		parametri = await dodajToken(parametri);
		let odgovor = await fetch(`${url}:${portRest}/baza/korisnici`, parametri);

		// let tekst = await odgovor.text();
		// console.log(tekst);
		poruka.innerHTML = JSON.parse(await odgovor.text()).opis;
		console.log(odgovor.status);
	});
});
