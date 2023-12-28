import { useState } from 'react'
import Slowo from './Slowo'
import Klawiatura from './Klawiatura'
import listaSłów from './piecioliterowe'

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
	const [trybTrudny, setTrybTrudny] = useState(false)
	const [trybDebug, setTrybDebug] = useState(false)

	const wypróbowane: string = próby.slice(numerPróby - 1).join('')

	function mutacjaListy<T>(lista: T[], pozycja: number, nowyElement: T) {
		return lista.map((element, indeks) => {
			if(indeks == pozycja) {
				return nowyElement
			} else {
				return element
			}
		})
	}

	function resetuj() {
		setRozwiązanie(losowyElement(listaSłów))
		setPróby(Array(liczbaPrób).fill(''))
		setNumerPróby(0)
		setWygranko('')
	}

	function backspace() {
		setPróby(mutacjaListy(próby, numerPróby, próby[numerPróby].slice(0, -1)))
	}

	function czyMogęPrzełączyćTrybTrudny() {
		if(trybDebug) {
			return true // zawsze można przełączyć tryb w trybie debug
		}
		if(wygranko != '') {
			return false // zablokuj przełączanie po wygranej/przegranej
		}
		if(numerPróby > 0) {
			return false // zablokuj przełączanie po rozpoczęciu gry
		}
		if(próby[0] != '') {
			return false // zablokuj przełączanie po rozpoczęciu gry
		}

		return true
	}

	function przełączTrybTrudny() {
		if(czyMogęPrzełączyćTrybTrudny()) {
			setTrybTrudny(!trybTrudny)
		} else {
			alert('Nie można przełączyć trybu po rozpoczęciu gry.')
		}
	}

	function dopiszLiterkę(literka: string) {
		if(wygranko != '') {
			return // zablokuj wpisywanie po wygranej/przegranej
		}
		if(trybTrudny) {
			if(wypróbowane.includes(literka) && !rozwiązanie.includes(literka)) {
				alert('Ograniczenie trybu trudnego: nie można wpisać tej litery, bo jest niepoprawna.')
				return // zablokuj ponowne wpisywanie tej samej błędnej literki
			}
		}
		if(!dozwoloneLiterki.includes(literka)) {
			return // zablokuj wpisywanie niedozwolonych liter
		}

		const bezOstatniej = próby[numerPróby].slice(0, długośćSłowa - 1)

		setPróby(mutacjaListy(próby, numerPróby, bezOstatniej + literka))
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
		{
			trybDebug &&
			<p>rozwiązanie: "{rozwiązanie}"</p>
		}
		<p>
			<label>
				<input type="checkbox" checked={trybTrudny} onChange={przełączTrybTrudny} />
				tryb trudny
			</label>
			<label>
				<input type="checkbox" checked={trybDebug} onChange={() => {setTrybDebug(!trybDebug)}} />
				tryb oszusta (debug)
			</label>
		</p>
		<Klawiatura
			wypróbowane={wypróbowane}
			rozwiązanie={rozwiązanie}
			dozwolone={dozwoloneLiterki}
			klikLiterka={dopiszLiterkę}
			klikEnter={() => console.log('enter')}
			klikBackspace={backspace}
		/>
	</div>
}

export default Gra
