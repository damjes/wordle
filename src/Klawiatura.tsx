import Literka from "./Literka"
import './Klawiatura.scss'

function ustalKlasę(literka: string, wypróbowane: string, rozwiązanie: string) {
	if(wypróbowane.includes(literka)) {
		if(rozwiązanie.includes(literka)) {
			return 'dobrze'
		}
		return 'zle'
	}

	return 'nieznana'
}

function Klawiatura(props: {
	wypróbowane: string,
	rozwiązanie: string,
	dozwolone: string[],
	klik: (literka: string) => void
}) {
	const literki = props.dozwolone.map(literka =>
		<Literka
			literka={literka}
			klasa={ustalKlasę(literka, props.wypróbowane, props.rozwiązanie)}
			klik={() => props.klik(literka)}
		/>
	)

	return <div className="klawiatura">
		{literki}
	</div>
}

export default Klawiatura
