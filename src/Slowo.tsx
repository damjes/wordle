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

function ustalKlasę(etap: string, słowo: string, rozwiązanie: string, indeks: number) {
	if (etap == 'przed') {
		return 'nieznana'
	}

	if (etap == 'teraz') {
		return ustalKlasęWpisywane(słowo, indeks)
	}

	return ustalKlasęWcześniejsze(słowo, rozwiązanie, indeks)
}

function Słowo(
	props: {
		etap: string,
		słowo?: string,
		rozwiązanie: string
	}
) {
	const słowo = props.słowo || ''

	const literki = słowo.padEnd(długośćSłowa, ' ').split('').map(
		(literka, indeks) => <Literka literka={literka} klasa={ustalKlasę(
			props.etap,
			słowo,
			props.rozwiązanie,
			indeks
		)} />
	)

	return <div className="slowo">
		{literki}
	</div>
}

export default Słowo
