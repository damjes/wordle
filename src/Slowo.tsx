import Literka from "./Literka";
import './Slowo.scss'

const długośćSłowa = 5

function ustalKlasęWpisywane(słowo: string, indeks: number) {
	const gdzieKursor = słowo.length - (długośćSłowa == słowo.length ? 1 : 0)
	// odejmij jeden jeśli na końcu słowa
	// NB: słowo.length to indeks pierwszej wolnej komórki za słowem
	if (indeks == gdzieKursor) {
		return 'kursor'
	} else {
		return 'nieznana'
	}
}

function ustalKlasęWcześniejsze(słowo: string, rozwiązanie: string, indeks: number) {
	const literka = słowo[indeks]
	if (literka == rozwiązanie[indeks]) {
		return 'dobrze'
	} else if (rozwiązanie.includes(literka)) {
		return 'przesunieta'
	} else {
		return 'zle'
	}
}

function ustalKlasę(wpisujeTeraz: boolean, słowo: string, rozwiązanie: string, indeks: number) {
	if (wpisujeTeraz) {
		return ustalKlasęWpisywane(słowo, indeks)
	} else {
		return ustalKlasęWcześniejsze(słowo, rozwiązanie, indeks)
	}
}

function Słowo(
	props: {
		wpisujeTeraz: boolean,
		słowo: string,
		rozwiązanie: string
	}
) {
	const literki = props.słowo.padEnd(długośćSłowa, ' ').split('').map(
		(literka, indeks) => <Literka literka={literka} klasa={ustalKlasę(
			props.wpisujeTeraz,
			props.słowo,
			props.rozwiązanie,
			indeks
		)} />
	)

	return <div className="slowo">
		{literki}
	</div>
}

export default Słowo
