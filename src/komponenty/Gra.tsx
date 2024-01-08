import { useEffect, useRef, useState } from 'react'

import Klawiatura from './Klawiatura'
import Okienko from './Okienko'
import Słowo from './Slowo'

import listaSłów from '../slownik'

import './Gra.scss'

function losowyElement<T>(tablica: T[]): T {
	const indeks = Math.floor(Math.random() * tablica.length)
	return tablica[indeks]
}

function mutacjaListy<T>(pozycja: number, nowyElement: T) {
	return (lista: Array<T>) => lista.map((element, indeks) => {
		if(indeks == pozycja) {
			return nowyElement
		} else {
			return element
		}
	})
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
	const [zmianaTrybuTrudnego, setZmianaTrybuTrudnego] = useState(true)
	const [trybDebug, setTrybDebug] = useState(false)
	const [potwierdzeniePoddaniaSię, setPotwierdzeniePoddaniaSię] = useState(false)
	const [treśćOkienka, setTreśćOkienka] = useState('')
	const [tytułOkienka, setTytułOkienka] = useState('')
	const [trigerOkienka, setTrigerOkienka] = useState(false)

	const okienko = useRef<HTMLDialogElement>(null)

	const wypróbowane: string = próby.slice(0, numerPróby).join('')

	useEffect(() => {
		if(treśćOkienka != '') {
			okienko.current?.showModal()
		}}, [trigerOkienka])

	function resetuj() {
		setRozwiązanie(losowyElement(listaSłów))
		setPróby(Array(liczbaPrób).fill(''))
		setNumerPróby(0)
		setWygranko('')
		setZmianaTrybuTrudnego(true)
		setPotwierdzeniePoddaniaSię(false)
	}

	function backspace() {
		if(wygranko != '') {
			return // zablokuj usuwanie po wygranej/przegranej
		}
		setPotwierdzeniePoddaniaSię(false)
		setPróby(mutacjaListy(numerPróby, próby[numerPróby].slice(0, -1)))
	}

	function enter() {
		if(wygranko != '') {
			return // zablokuj enter po wygranej/przegranej
		}

		setPotwierdzeniePoddaniaSię(false)

		const bieżąceSłowo = próby[numerPróby]

		if(bieżąceSłowo.length != długośćSłowa) {
			setTytułOkienka('Niewpisane słowo')
			setTreśćOkienka('Słowo jest za krótkie. Wpisz całe słowo.')
			setTrigerOkienka(!trigerOkienka)
			return
		}

		setZmianaTrybuTrudnego(false)

		if(trybTrudny) {
			if(!listaSłów.includes(bieżąceSłowo)) {
				setTytułOkienka('Ograniczenie trybu trudnego')
				setTreśćOkienka('Nie ma takiego słowa.')
				setTrigerOkienka(!trigerOkienka)
				setPróby(mutacjaListy(numerPróby, ''))
				return
			}
		}

		const nowyNumerPróby = numerPróby + 1

		if(bieżąceSłowo == rozwiązanie) {
			setWygranko('tak')
			setZmianaTrybuTrudnego(true)
			setTytułOkienka('Wygranko')
			setTreśćOkienka('Gratulacje! Udało Ci się odgadnąć słowo.')
			setTrigerOkienka(!trigerOkienka)
			return
		}

		if(nowyNumerPróby == liczbaPrób) {
			setWygranko('nie')
			setZmianaTrybuTrudnego(true)
			setTytułOkienka('Przegranko')
			setTreśćOkienka('Niestety, nie udało Ci się odgadnąć słowa.')
			setTrigerOkienka(!trigerOkienka)
			return
		}

		setNumerPróby(nowyNumerPróby)
	}

	function przełączTrybTrudny() {
		setPotwierdzeniePoddaniaSię(false)
		if(zmianaTrybuTrudnego) {
			setTrybTrudny(!trybTrudny)
		}
	}

	function dopiszLiterkę(literka: string) {
		setPotwierdzeniePoddaniaSię(false)
		if(wygranko != '') {
			return // zablokuj wpisywanie po wygranej/przegranej
		}
		if(trybTrudny) {
			if(wypróbowane.includes(literka) && !rozwiązanie.includes(literka)) {
				setTytułOkienka('Ograniczenie trybu trudnego')
				setTreśćOkienka('Nie można wpisać tej litery, bo jest niepoprawna.')
				setTrigerOkienka(!trigerOkienka)
				return // zablokuj ponowne wpisywanie tej samej błędnej literki
			}
		}
		if(!dozwoloneLiterki.includes(literka)) {
			return // zablokuj wpisywanie niedozwolonych liter
		}

		const bezOstatniej = próby[numerPróby].slice(0, długośćSłowa - 1)

		setPróby(mutacjaListy(numerPróby, bezOstatniej + literka))
	}

	const słowa = próby.map((słowo, indeks) =>
		<Słowo
			etap={wygranko == '' ?
				(indeks == numerPróby ? 'teraz' : indeks < numerPróby ? 'po' : 'przed') :
				'po'}
			słowo={słowo}
			rozwiązanie={rozwiązanie}
			key={indeks}
		/>
	)

	const napisResetu = wygranko == '' ?
		(potwierdzeniePoddaniaSię ? 'Czy na pewno?' : 'Poddaj się') :
		'Zagraj jeszcze raz'

	const funkcjaResetu = wygranko == '' ?
		(potwierdzeniePoddaniaSię ? () => setWygranko('nie') : () => setPotwierdzeniePoddaniaSię(true)) :
		resetuj

	const klasaResetu = 'przyciskResetu' + (wygranko == '' ?
		(potwierdzeniePoddaniaSię ? ' naPewno' : '') :
		' jeszczeRaz'
	)

	function klawiaturaKlik(e) {
		if (e.key == "Enter") {
			enter()
		} else if (e.key == "Backspace") {
			backspace()
		} else {
			dopiszLiterkę(e.key)
		}
	}

	useEffect(() => {
		document.getElementById("gra").focus()
	}, [])

	return <div id="gra" className="gra" tabIndex="0" onKeyDown={klawiaturaKlik}>
		<Okienko
			tytuł={tytułOkienka}
			tekst={treśćOkienka}
			refOkienka={okienko} />
		<div className="macierz">
			{słowa}
		</div>
		{
			trybDebug &&
			<>
				<p>rozwiązanie: "{rozwiązanie}"</p>
				<p>wygranko: "{wygranko}"</p>
				<p>wypróbowane: "{wypróbowane}"</p>
				<p>
					<button onClick={() => setNumerPróby(numerPróby-1)}>-</button>
					<button onClick={() => setNumerPróby(numerPróby+1)}>+</button>
				</p>
			</>
		}
		<p className="wlacznikTrybuTrudnego">
			<label>
				<input
					type="checkbox"
					checked={trybTrudny}
					disabled={!zmianaTrybuTrudnego}
					onChange={przełączTrybTrudny} />
				tryb trudny
			</label>
			<label>
				<input type="checkbox" checked={trybDebug} onChange={() => {setTrybDebug(!trybDebug)}} />
				tryb oszusta (debug)
			</label>
		</p>
		<button className={klasaResetu} onClick={funkcjaResetu}>{napisResetu}</button>
		{
			wygranko == 'nie' &&
			<div className="opisRozwiazania">
				<p>Rozwiązanie to:</p>
				<Słowo
					etap='po'
					słowo={rozwiązanie}
					rozwiązanie={rozwiązanie}
				/>
			</div>
		}
		<Klawiatura
			wypróbowane={wypróbowane}
			rozwiązanie={rozwiązanie}
			dozwolone={dozwoloneLiterki}
			klikLiterka={dopiszLiterkę}
			klikEnter={enter}
			klikBackspace={backspace}
		/>
	</div>
}

export default Gra
