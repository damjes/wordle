import Literka from '../Literka/Literka'
import './Klawiatura.sass'

function ustalKolorek(
	literka: string,
	wypróbowane: string,
	rozwiązanie: string
) {
	if (wypróbowane.includes(literka)) {
		if (rozwiązanie.includes(literka)) {
			return 'dobrze'
		}
		return 'zle'
	}

	return 'nieznana'
}

function ustalWypustkę(literka: string) {
	if (literka === 't' || literka === 'n') {
		// te literki mają wypustki w układzie Colemaka
		return ' wypustka'
	} else {
		return ''
	}
}

function ustalKlasę(literka: string, wypróbowane: string, rozwiązanie: string) {
	return (
		ustalKolorek(literka, wypróbowane, rozwiązanie) + ustalWypustkę(literka)
	)
}

function Klawiatura(props: {
	wypróbowane: string
	rozwiązanie: string
	dozwolone: string[][]
	klikLiterka: (literka: string) => void
	klikEnter: () => void
	klikBackspace: () => void
}) {
	function dajZawartoscWiersza(wiersz: string[]) {
		return wiersz.map((literka) => (
			<Literka
				literka={literka}
				klasa={
					'klawisz ' +
					ustalKlasę(literka, props.wypróbowane, props.rozwiązanie)
				}
				klik={() => props.klikLiterka(literka)}
				key={literka}
			/>
		))
	}

	const znakiSterujące = (
		<>
			<Literka
				literka="⮐"
				klasa="klawisz enter"
				klik={props.klikEnter}
				key={'enter'}
			/>
			<Literka
				literka="⌫"
				klasa="klawisz backspace"
				klik={props.klikBackspace}
				key={'backspace'}
			/>
		</>
	)

	// do ostatniego wiersza dodajemy znaki sterujące
	const literki = props.dozwolone.map((wiersz, indeks) => (
		<div className="wiersz" key={indeks}>
			{dajZawartoscWiersza(wiersz)}
			{indeks === props.dozwolone.length - 1 && znakiSterujące}
		</div>
	))

	return <div className="klawiatura">{literki}</div>
}

export default Klawiatura
