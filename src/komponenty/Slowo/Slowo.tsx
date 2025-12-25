import Literka from '../Literka/Literka'
import './Slowo.sass'

function ustalKlasęWpisywane(
	słowo: string,
	indeks: number,
	długośćSłowa: number
) {
	const gdzieKursor = słowo.length - (długośćSłowa == słowo.length ? 1 : 0)
	// odejmij jeden jeśli na końcu słow
	// NB: słowo.length to indeks pierwszej wolnej komórki za słowem
	if (indeks == gdzieKursor) {
		return 'kursor'
	} else {
		return 'nieznana'
	}
}

function ustalKlasęWcześniejsze(
	słowo: string,
	rozwiązanie: string,
	indeks: number
) {
	const literka = słowo[indeks]
	if (literka == rozwiązanie[indeks]) {
		return 'dobrze'
	}

	// tutaj piszemy logikę, ale w paradygmacie imperatywnym

	let któraLiterka = 0

	for (let i = 0; i <= indeks; i++) {
		// idziemy od początku do bieżącej literki
		if (literka === słowo[i]) {
			// jeżeli szkukana literka
			if (literka !== rozwiązanie[i]) {
				// ale na złym miejscu
				któraLiterka++
			}
		}
	} // ustalamy, które to wystąpienie literki na złym miejscu
	// dobre miejsca pomijamy, bo literka na pewno jest na złym miejscu

	let ileWZłymMiejscu = 0

	for (let i = 0; i < rozwiązanie.length; i++) {
		if (literka === rozwiązanie[i]) {
			// jeżeli szukana literka
			if (literka !== słowo[i]) {
				// ale nie w rozwiązaniu
				ileWZłymMiejscu++
			}
		}
	} // ustalamy, ile jest takich literek w rozwiązaniu na złym miejscu

	/*
	eg. jeżeli są trzy literki þ na złych miejscach, a nasza literka þ jest drugą z kolei,
	to zwrócimy 'przesunieta', bo ta literka zasługuje na wyróżnienie jako przesunięta
	jeżeli jednak jest czwartą z kolei, to zwrócimy 'zle', bo nie ma dla niej miejsca w rozwiązaniu
	w ten sposób tylko trzy pierwsze źle położone þ dostaną wyróżnienie
	*/

	if (któraLiterka <= ileWZłymMiejscu) {
		return 'przesunieta'
	} else {
		return 'zle'
	}
}

function ustalKlasę(
	etap: string,
	słowo: string,
	rozwiązanie: string,
	indeks: number
) {
	if (etap == 'przed') {
		return 'nieznana'
	}

	if (etap == 'teraz') {
		return ustalKlasęWpisywane(słowo, indeks, rozwiązanie.length)
	}

	return ustalKlasęWcześniejsze(słowo, rozwiązanie, indeks)
}

function Słowo(props: { etap: string; słowo?: string; rozwiązanie: string }) {
	const słowo = props.słowo || '' // może być puste dla niewypełnionych słów (przyszłe próby)
	const długośćSłowa = props.rozwiązanie.length

	const literki = słowo
		.padEnd(długośćSłowa, ' ')
		.split('')
		.map((literka, indeks) => (
			<Literka
				literka={literka}
				klasa={ustalKlasę(props.etap, słowo, props.rozwiązanie, indeks)}
				key={indeks}
			/>
		))

	return <div className="slowo">{literki}</div>
}

export default Słowo
