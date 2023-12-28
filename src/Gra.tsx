import { useState } from "react"
import Slowo from "./Slowo"
import Klawiatura from "./Klawiatura"
import listaSłów from "./piecioliterowe"

function losowyElement<T>(tablica: T[]): T {
	const indeks = Math.floor(Math.random() * tablica.length)
	return tablica[indeks]
}

function Gra() {
	const dozwoloneLiterki = "aąbcćdeęfghijklłmnńoóprsśtuwyzźż".split('')

	const [rozwiązanie, setRozwiązanie] = useState(losowyElement(listaSłów))
	const długośćSłowa = rozwiązanie.length
	const liczbaPrób = długośćSłowa + 1

	const [próby, setPróby] = useState(Array(liczbaPrób).fill(''))
	const [numerPróby, setNumerPróby] = useState(0)
	const [wygranko, setWygranko] = useState('')

	function resetuj() {
		setRozwiązanie(losowyElement(listaSłów))
		setPróby(Array(liczbaPrób).fill(''))
		setNumerPróby(0)
		setWygranko('')
	}

	const wypróbowane: string = próby.slice(numerPróby - 1).join('')

	function dopiszLiterkę(literka: string) {
		if(wygranko != '') {
			return // zablokuj wpisywanie po wygranej/przegranej
		}
		if(wypróbowane.includes(literka)) {
			return // zablokuj ponowne wpisywanie tej samej literki
		}
		if(!dozwoloneLiterki.includes(literka)) {
			return // zablokuj wpisywanie niedozwolonych liter
		}

		const bezOstatniej = próby[numerPróby].slice(0, długośćSłowa - 1)

		setPróby(próby.map((słowo, indeks) => {
			if(indeks == numerPróby) {
				return bezOstatniej + literka
			} else {
				return słowo
			}
		}))
	}

	const słowa = próby.map((słowo, indeks) =>
		<Slowo
			etap={indeks == numerPróby ? 'teraz' : indeks < numerPróby ? 'po' : 'przed'}
			słowo={słowo}
			rozwiązanie={rozwiązanie}
			key={indeks}
		/>
	)

	return <div className="gra">
		<div className="macierz">
			{słowa}
		</div>
		<button onClick={() => resetuj()}>RESET</button>
		<button onClick={() => setNumerPróby(numerPróby-1)}>-</button>
		<button onClick={() => setNumerPróby(numerPróby+1)}>+</button>
		<p>rozwiązanie: {'"' + rozwiązanie + '"'}</p>
		<Klawiatura
			wypróbowane="abcde"
			rozwiązanie={rozwiązanie}
			dozwolone={dozwoloneLiterki}
			klikLiterka={dopiszLiterkę}
			klikEnter={() => console.log('enter')}
			klikBackspace={() => console.log('backspace')}
		/>
	</div>
}

export default Gra
