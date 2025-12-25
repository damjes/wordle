import { useEffect, useRef, useState } from 'react'

import Klawiatura from '../Klawiatura/Klawiatura'
import Okienko from '../Okienko/Okienko'
import Słowo from '../Slowo/Slowo'

import listaSłów from '../../slownik'

import './Gra.sass'

enum Wynik {
	Wygranko,
	Przegranko,
	GraWToku,
}

function losowyElement<T>(tablica: T[]): T {
	const indeks = Math.floor(Math.random() * tablica.length)
	return tablica[indeks]
}

function mutacjaListy<T>(pozycja: number, nowyElement: T) {
	return (lista: Array<T>) =>
		lista.map((element, indeks) => {
			if (indeks == pozycja) {
				return nowyElement
			} else {
				return element
			}
		})
}

const znakiKlawiatury = [
	['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
	['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y'],
	['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o'],
	['z', 'x', 'c', 'v', 'b', 'k', 'm'],
]

const dozwoloneLiterki = znakiKlawiatury.flat()

function Gra() {
	const [rozwiązanie, setRozwiązanie] = useState(losowyElement(listaSłów))
	const długośćSłowa = rozwiązanie.length
	const liczbaPrób = 6

	const [próby, setPróby] = useState(Array(liczbaPrób).fill(''))
	const [numerPróby, setNumerPróby] = useState(0)
	const [wygranko, setWygranko] = useState<Wynik>(Wynik.GraWToku)
	const [trybTrudny, setTrybTrudny] = useState(false)
	const [zmianaTrybuTrudnego, setZmianaTrybuTrudnego] = useState(true)
	const [trybDebug, setTrybDebug] = useState(false)
	const [potwierdzeniePoddaniaSię, setPotwierdzeniePoddaniaSię] =
		useState(false)
	const [treśćOkienka, setTreśćOkienka] = useState('')
	const [tytułOkienka, setTytułOkienka] = useState('')
	const [trigerOkienka, setTrigerOkienka] = useState(false)

	const okienko = useRef<HTMLDialogElement>(null)

	const wypróbowane: string = próby.slice(0, numerPróby).join('')

	useEffect(() => {
		if (treśćOkienka != '') {
			okienko.current?.showModal()
		}
	}, [trigerOkienka])

	function resetuj() {
		setRozwiązanie(losowyElement(listaSłów))
		setPróby(Array(liczbaPrób).fill(''))
		setNumerPróby(0)
		setWygranko(Wynik.GraWToku)
		setZmianaTrybuTrudnego(true)
		setPotwierdzeniePoddaniaSię(false)
	}

	function backspace() {
		if (wygranko != Wynik.GraWToku) {
			return // zablokuj usuwanie po wygranej/przegranej
		}
		setPotwierdzeniePoddaniaSię(false)
		setPróby(mutacjaListy(numerPróby, próby[numerPróby].slice(0, -1)))
	}

	function enter() {
		if (wygranko != Wynik.GraWToku) {
			return // zablokuj enter po wygranej/przegranej
		}

		setPotwierdzeniePoddaniaSię(false)

		const bieżąceSłowo = próby[numerPróby]

		if (bieżąceSłowo.length != długośćSłowa) {
			setTytułOkienka('Niewpisane słowo')
			setTreśćOkienka('Słowo jest za krótkie. Wpisz całe słowo.')
			setTrigerOkienka(!trigerOkienka)
			return
		}

		setZmianaTrybuTrudnego(false)

		if (trybTrudny) {
			if (!listaSłów.includes(bieżąceSłowo)) {
				setTytułOkienka('Ograniczenie trybu trudnego')
				setTreśćOkienka('Nie ma takiego słowa.')
				setTrigerOkienka(!trigerOkienka)
				setPróby(mutacjaListy(numerPróby, ''))
				return
			}
		}

		const nowyNumerPróby = numerPróby + 1

		if (bieżąceSłowo == rozwiązanie) {
			setWygranko(Wynik.Wygranko)
			setZmianaTrybuTrudnego(true)
			setTytułOkienka('Wygranko')
			setTreśćOkienka('Gratulacje! Udało Ci się odgadnąć słowo.')
			setTrigerOkienka(!trigerOkienka)
			return
		}

		if (nowyNumerPróby == liczbaPrób) {
			setWygranko(Wynik.Przegranko)
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
		if (zmianaTrybuTrudnego) {
			setTrybTrudny(!trybTrudny)
		}
	}

	function dopiszLiterkę(literka: string) {
		setPotwierdzeniePoddaniaSię(false)
		if (wygranko != Wynik.GraWToku) {
			return // zablokuj wpisywanie po wygranej/przegranej
		}
		if (trybTrudny) {
			if (
				wypróbowane.includes(literka) &&
				!rozwiązanie.includes(literka)
			) {
				setTytułOkienka('Ograniczenie trybu trudnego')
				setTreśćOkienka(
					'Nie można wpisać tej litery, bo jest niepoprawna.'
				)
				setTrigerOkienka(!trigerOkienka)
				return // zablokuj ponowne wpisywanie tej samej błędnej literki
			}
		}
		if (!dozwoloneLiterki.includes(literka)) {
			return // zablokuj wpisywanie niedozwolonych liter
		}

		const bezOstatniej = próby[numerPróby].slice(0, długośćSłowa - 1)

		setPróby(mutacjaListy(numerPróby, bezOstatniej + literka))
	}

	const słowa = próby.map((słowo, indeks) => (
		<Słowo
			etap={
				wygranko == Wynik.GraWToku
					? indeks == numerPróby
						? 'teraz'
						: indeks < numerPróby
						? 'po'
						: 'przed'
					: 'po'
			}
			słowo={słowo}
			rozwiązanie={rozwiązanie}
			key={indeks}
		/>
	))

	const napisResetu =
		wygranko == Wynik.GraWToku
			? potwierdzeniePoddaniaSię
				? 'Czy na pewno?'
				: 'Poddaj się'
			: 'Zagraj jeszcze raz'

	const funkcjaResetu =
		wygranko == Wynik.GraWToku
			? potwierdzeniePoddaniaSię
				? () => setWygranko(Wynik.Przegranko)
				: () => setPotwierdzeniePoddaniaSię(true)
			: resetuj

	const klasaResetu =
		'przyciskResetu' +
		(wygranko == Wynik.GraWToku
			? potwierdzeniePoddaniaSię
				? ' naPewno'
				: ''
			: ' jeszczeRaz')

	function klawiaturaKlik(e: React.KeyboardEvent<HTMLDivElement>) {
		if (e.key == 'Enter') {
			e.preventDefault()
			enter()
		} else if (e.key == 'Backspace') {
			backspace()
		} else {
			dopiszLiterkę(e.key)
		}
	}

	useEffect(() => {
		document.getElementById('gra')!.focus()
	}, [])

	return (
		<div id="gra" className="gra" tabIndex={0} onKeyDown={klawiaturaKlik}>
			<Okienko
				tytuł={tytułOkienka}
				tekst={treśćOkienka}
				refOkienka={okienko}
			/>
			<div className="macierz">{słowa}</div>
			{trybDebug && (
				<>
					<p>rozwiązanie: "{rozwiązanie}"</p>
					<p>wygranko: "{wygranko}"</p>
					<p>wypróbowane: "{wypróbowane}"</p>
					<p>
						<button
							onClick={() => setNumerPróby(numerPróby - 1)}
							disabled={numerPróby === 0}
						>
							-
						</button>
						<button
							onClick={() => setNumerPróby(numerPróby + 1)}
							disabled={numerPróby === liczbaPrób - 1}
						>
							+
						</button>
					</p>
				</>
			)}
			<p className="wlacznikTrybuTrudnego">
				<label>
					<input
						type="checkbox"
						checked={trybTrudny}
						disabled={!zmianaTrybuTrudnego}
						onChange={przełączTrybTrudny}
					/>
					tryb trudny
				</label>
				<label>
					<input
						type="checkbox"
						checked={trybDebug}
						onChange={() => {
							setTrybDebug(!trybDebug)
						}}
					/>
					tryb oszusta (debug)
				</label>
			</p>
			<button className={klasaResetu} onClick={funkcjaResetu}>
				{napisResetu}
			</button>
			{wygranko == Wynik.Przegranko && (
				<div className="opisRozwiazania">
					<p>Rozwiązanie to:</p>
					<Słowo
						etap="po"
						słowo={rozwiązanie}
						rozwiązanie={rozwiązanie}
					/>
				</div>
			)}
			{wygranko != Wynik.GraWToku && (
				<div className="slownik">
					Sprawdź rozwiązanie w{' '}
					<a href={'https://sjp.pl/' + rozwiązanie}>
						słowniku SJP.PL
					</a>
				</div>
			)}
			<Klawiatura
				wypróbowane={wypróbowane}
				rozwiązanie={rozwiązanie}
				dozwolone={znakiKlawiatury}
				klikLiterka={dopiszLiterkę}
				klikEnter={enter}
				klikBackspace={backspace}
			/>
		</div>
	)
}

export default Gra
