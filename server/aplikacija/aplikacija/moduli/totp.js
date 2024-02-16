const totp = require("totp-generator");
const kodovi = require("./kodovi.js");
const base32 = require("base32-encoding");

exports.kreirajTajniKljuc = function (korime) {
	let tekst = korime + new Date() + kodovi.dajNasumceBroj(10000000, 90000000);
	let hash = kodovi.kreirajSHA1(tekst); //kodovi.kreirajSHA256(tekst);
	let tajniKljuc = base32.stringify(hash, "ABCDEFGHIJKLMNOPRSTQRYWXZ234567");
	return tajniKljuc.toUpperCase();
};

exports.provjeriTOTP = function (uneseniKod, tajniKljuc) {
	const kod = totp(tajniKljuc, {
		digits: 6,
		algorithm: "SHA-1",
		period: 30,
	});
	console.log(kod);
	if (uneseniKod == kod) return true;

	return false;
};
