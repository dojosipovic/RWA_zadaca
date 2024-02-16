BEGIN;
CREATE TABLE "korisnik"(
  "korime" VARCHAR(20) PRIMARY KEY NOT NULL,
  "email" VARCHAR(50) NOT NULL,
  "lozinka" TEXT NOT NULL,
  "ime" VARCHAR(30),
  "prezime" VARCHAR(50),
  "drzava" VARCHAR(40),
  "mjesto" VARCHAR(60),
  "opis" TEXT,
  "admin" INTEGER,
  "twofa" INTEGER,
  "tajnikljuc" TEXT,
  "prviput" INTEGER,
  CONSTRAINT "email_UNIQUE"
    UNIQUE("email")
);
CREATE TABLE "serija"(
  "tmdb_id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(100) NOT NULL,
  "opis" TEXT NOT NULL,
  "br_sezona" INTEGER NOT NULL,
  "br_epizoda" INTEGER NOT NULL,
  "popularnost" DECIMAL NOT NULL,
  "slika" TEXT NOT NULL,
  "stranica" TEXT NOT NULL,
  "originalno_ime" VARCHAR(100) NOT NULL,
  "tip" VARCHAR(50) NOT NULL,
  "prosjecno_glasovi" DECIMAL NOT NULL,
  "broj_glasova" INTEGER NOT NULL,
  "originalni_jezik" VARCHAR(45) NOT NULL
);
CREATE TABLE "sezona"(
  "tmdb_id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(200) NOT NULL,
  "opis" TEXT NOT NULL,
  "slika" TEXT NOT NULL,
  "br_sezone" INTEGER NOT NULL,
  "br_epizoda" INTEGER NOT NULL,
  "prosjecno_glasovi" DECIMAL NOT NULL,
  "serija_tmdb_id" INTEGER NOT NULL,
  CONSTRAINT "fk_sezona_serija"
    FOREIGN KEY("serija_tmdb_id")
    REFERENCES "serija"("tmdb_id")
);
CREATE INDEX "sezona.fk_sezona_serija_idx" ON "sezona" ("serija_tmdb_id");
CREATE TABLE "favoriti"(
  "korime" VARCHAR(20) NOT NULL,
  "tmdb_id_serije" INTEGER NOT NULL,
  PRIMARY KEY("korime","tmdb_id_serije"),
  CONSTRAINT "fk_korisnik_has_serija_korisnik1"
    FOREIGN KEY("korime")
    REFERENCES "korisnik"("korime"),
  CONSTRAINT "fk_korisnik_has_serija_serija1"
    FOREIGN KEY("tmdb_id_serije")
    REFERENCES "serija"("tmdb_id")
);
CREATE INDEX "favoriti.fk_korisnik_has_serija_serija1_idx" ON "favoriti" ("tmdb_id_serije");
CREATE INDEX "favoriti.fk_korisnik_has_serija_korisnik1_idx" ON "favoriti" ("korime");
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "datum" DATE NOT NULL,
  "vrijeme" TIME NOT NULL,
  "zahtjev" TEXT NOT NULL CHECK("zahtjev" IN('GET', 'POST', 'PUT', 'DELETE')),
  "resurs" TEXT NOT NULL,
  "tijelo" TEXT,
  "korime" VARCHAR(20)
);
COMMIT;