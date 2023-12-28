import { useState } from "react"
import Slowo from "./Slowo"
import Klawiatura from "./Klawiatura"

function Gra() {
	const [słowo, setSłowo] = useState('')
	const [etap, setEtap] = useState('teraz')
	const dozwoloneLiterki = "aąbcćdeęfghijklłmnńoóprsśtuwyzźż".split('')
	const [wygranko, setWygranko] = useState('')

	const rozwiązanie = 'kotek'

	const długośćSłowa = rozwiązanie.length
	const liczbaPrób = długośćSłowa + 1

	function resetuj() {
		setSłowo('')
		setEtap('teraz')
		setWygranko('')
	}

	function dopiszLiterke(literka: string) {
		if(!dozwoloneLiterki.includes(literka)) {
			return
		}
		if(słowo.length < długośćSłowa) {
			setSłowo(słowo + literka)
		} else {
			setSłowo(słowo.slice(0, -1) + literka)
		}
	}

	return <div className="gra">
		<Slowo etap={etap} słowo={słowo} rozwiązanie={rozwiązanie} />
		<button onClick={() => resetuj()}>RESET</button>
		<button onClick={() => dopiszLiterke('e')}>e</button>
		<button onClick={() => dopiszLiterke('k')}>k</button>
		<button onClick={() => dopiszLiterke('o')}>o</button>
		<button onClick={() => dopiszLiterke('t')}>t</button>
		<button onClick={() => dopiszLiterke('z')}>z</button>
		<button onClick={() => setEtap('po')}>PO</button>
		<p>słowo: {'"' + słowo + '" ' + słowo.length.toString()}</p>
		<Klawiatura
			wypróbowane="abcde"
			rozwiązanie={rozwiązanie}
			dozwolone={dozwoloneLiterki}
			klikLiterka={dopiszLiterke}
			klikEnter={() => setEtap('po')}
			klikBackspace={() => setSłowo(słowo.slice(0, -1))}
		/>
	</div>
}

export default Gra
