import express from "express";
import sesija from "express-session";
import kolacici from "cookie-parser";
import cors from "cors";
import path from "path";

import Konfiguracija from "./aplikacija/Konfiguracija.js";
import RestKorisnik from "./aplikacija/servis/restKorisnik.js";
import RestSerija from "./aplikacija/servis/restSerija.js";
import RestTMDB from "./aplikacija/servis/restTMDB.js";
import RestDnevnik from "./aplikacija/servis/restDnevnik.js";
import github from "./aplikacija/servis/restGithub.js";

// import portovi from "/var/www/RWA/2023/portovi.js";
const server = express();
// const port = portovi.djosipovi21;
const port = 12000;
const konf = new Konfiguracija();
const __dirname = path.resolve();

konf
	.ucitajKonfiguraciju()
	.then(PokreniServer)
	.catch((greska) => {
		//console.log(greska);
		if (process.argv.length == 2) {
			console.error("Niste proslijedili ulazni parametar!");
		} else {
			console.error(greska);
		}
	});

function PokreniServer() {
	server.use(
		cors({
			origin: "http://localhost:4200",
			methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		})
	);
	server.use((req, res, next) => {
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization"
		);
		res.setHeader("Access-Control-Expose-Headers", "Authorization");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		next();
	});
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	server.use(kolacici());

	server.use(
		sesija({
			secret: konf.dajKonf().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);
	server.use("/dokumentacijafolder", express.static("./dokumentacija"));
	server.use("/", express.static("./angular/browser"));

	pripremiPutanjeKorisnik();
	pripremiPutanjeTMDB();

	server.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "angular", "browser", "index.html"));
	});
	server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		odgovor.json({ opis: "nema resursa" });
	});
	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}

function pripremiPutanjeKorisnik() {
	let restKorisnik = new RestKorisnik(
		konf.dajKonf().jwtTajniKljuc,
		konf.dajKonf().jwtValjanost,
		konf.dajKonf().tajniKljucCaptcha
	);
	let restSerija = new RestSerija(konf.dajKonf().jwtTajniKljuc);
	let restDnevnik = new RestDnevnik();

	server.get("/githublogin", github.githubPrijava);
	server.post("/githubodjava", github.githubOdjava);
	server.get("/githubPovratno", github.githubPovratno);
	server.get("/githubPodaci", github.githubPodaci);

	server.get("/baza/korisnici", restKorisnik.getKorisnici.bind(restKorisnik));
	server.post("/baza/korisnici", restKorisnik.postKorisnici.bind(restKorisnik));
	server.delete(
		"/baza/korisnici",
		restKorisnik.deleteKorisnici.bind(restKorisnik)
	);
	server.put("/baza/korisnici", restKorisnik.putKorisnici.bind(restKorisnik));

	server.post("/baza/favoriti", restSerija.postFavoriti.bind(restSerija));
	server.get("/baza/favoriti", restSerija.getFavoriti.bind(restSerija));
	server.put("/baza/favoriti", restSerija.putFavoriti.bind(restSerija));
	server.delete("/baza/favoriti", restSerija.deleteFavoriti.bind(restSerija));

	server.post("/baza/favoriti/:id", restSerija.postFavorit.bind(restSerija));
	server.get("/baza/favoriti/:id", restSerija.getFavorit.bind(restSerija));
	server.put("/baza/favoriti/:id", restSerija.putFavorit.bind(restSerija));
	server.delete(
		"/baza/favoriti/:id",
		restSerija.deleteFavorit.bind(restSerija)
	);

	server.get(
		"/baza/korisnici/:korime",
		restKorisnik.getKorisnik.bind(restKorisnik)
	);
	server.post(
		"/baza/korisnici/:korime",
		restKorisnik.postKorisnik.bind(restKorisnik)
	);
	server.delete(
		"/baza/korisnici/:korime",
		restKorisnik.deleteKorisnik.bind(restKorisnik)
	);
	server.put(
		"/baza/korisnici/:korime",
		restKorisnik.putKorisnik.bind(restKorisnik)
	);

	server.get(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.getKorisnikPrijava.bind(restKorisnik)
	);
	server.post(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.postKorisnikPrijava.bind(restKorisnik)
	);
	server.put(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.putKorisnikPrijava.bind(restKorisnik)
	);
	server.delete(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.deleteKorisnikPrijava.bind(restKorisnik)
	);

	server.get("/baza/dnevnik", restDnevnik.getDnevnik);
	server.post("/baza/dnevnik", restDnevnik.postDnevnik);
	server.put("/baza/dnevnik", restDnevnik.putDnevnik);
	server.delete("/baza/dnevnik", restDnevnik.deleteDnevnik);
}

function pripremiPutanjeTMDB() {
	let restTMDB = new RestTMDB(konf.dajKonf()["tmdbApiKeyV3"]);
	server.get("/api/tmdb/serije", restTMDB.getSerije.bind(restTMDB));
	server.get("/api/tmdb/serija", restTMDB.getSerija.bind(restTMDB));
}
