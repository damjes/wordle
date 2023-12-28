import Literka from './Literka'
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
	klikLiterka: (literka: string) => void,
	klikEnter: () => void,
	klikBackspace: () => void,
}) {
	const literki = props.dozwolone.map(literka =>
		<Literka
			literka={literka}
			klasa={'klawisz ' + ustalKlasę(literka, props.wypróbowane, props.rozwiązanie)}
			klik={() => props.klikLiterka(literka)}
			key={literka}
		/>
	)

	return <div className="klawiatura">
		{literki}
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
	</div>
}

export default Klawiatura
