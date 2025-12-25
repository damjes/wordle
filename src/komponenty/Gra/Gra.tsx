import { useEffect, useRef, useState } from 'react'

import Klawiatura from '../Klawiatura/Klawiatura'
import Okienko from '../Okienko/Okienko'
import Słowo from '../Slowo/Slowo'

import listaSłów from '../../slownik'

import './Gra.sass'
import './ciemny.sass'

enum Wynik {
	Wygranko,
	Przegranko,
	GraWToku,
}

function losowyElement<T>(tablica: T[]): T {
	const indeks = Math.floor(Math.random() * tablica.length)
	return tablica[indeks]
}

/*
funkcja zmienia n-ty element listy na nowyElement

sygnatura: (number, T) => (Array<T>) => Array<T>
NB, że zwraca funkcję typu (Array<T>) => Array<T>
(potocznie nazywam ją zmieniarką)

użyto curryingu, żeby łatwiej było używać w setState
eg. setLista(mutacjaListy(2, 'nowa wartość'))

bez curryingu funkcja miałaby sygnaturę: (number, T, Array<T>) => Array<T>
ale wtedy w setState trzeba by było pisać:
setLista((staraLista) => mutacjaListy(2, 'nowa wartość', staraLista))
*/

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

function czySystemowyTrybCiemny() {
	return (
		window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	)
}

// klawisze w kolejności odpowiadającej układowi klawiatury
// oczywiście chodzi o układ Colemaka :) (patrz: colemak.com)

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

	const [trybTrudny, setTrybTrudny] = useState(false) // jaki tryb jest ustawiony
	const [zmianaTrybuTrudnego, setZmianaTrybuTrudnego] = useState(true) // i czy można go zmienić
	// (trybu nie można zmienić w trakcie gry)

	const [trybDebug, setTrybDebug] = useState(false)

	const [trybCiemny, setTrybCiemny] = useState(czySystemowyTrybCiemny())

	// poddanie się wymaga potwierdzenia
	// po pierwszym kliknięciu przycisku przycisk się zmienia w potwierdzenie
	// kliknięcie gdziekolwiek indziej anuluje potwierdzenie
	const [potwierdzeniePoddaniaSię, setPotwierdzeniePoddaniaSię] =
		useState(false)

	const [treśćOkienka, setTreśćOkienka] = useState('')
	const [tytułOkienka, setTytułOkienka] = useState('')
	const [trigerOkienka, setTrigerOkienka] = useState(false) // patrz useEffect z trigerOkienka

	const okienko = useRef<HTMLDialogElement>(null)

	const wypróbowane: string = próby.slice(0, numerPróby).join('')

	// włączamy lub wyłączamy klasę ciemny na elemencie <html>
	// NB na drugi parametr toggla! :)
	// https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle#force
	useEffect(() => {
		document.documentElement.classList.toggle('ciemny', trybCiemny)
	}, [trybCiemny])

	/*
	okienka modalne działają w oparciu o API dialogów
	https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
	musimy jakoś wywołać showModal() na elemencie dialogu
	pomysł jest prosty: zanegować trigerOkienka za każdym razem,
	gdy chcemy pokazać okienko, a potem w useEffect z trigerOkienka
	wywołać showModal() na elemencie dialogu
	*/
	useEffect(() => {
		if (treśćOkienka != '') {
			okienko.current?.showModal()
		}
	}, [trigerOkienka])

	function resetuj() {
		setRozwiązanie(losowyElement(listaSłów))
		setPróby(Array(liczbaPrób).fill('')) // próby wyświetlamy mapem, więc potrzebujemy listy pustych prób
		setNumerPróby(0)
		setWygranko(Wynik.GraWToku)
		setZmianaTrybuTrudnego(true)
		setPotwierdzeniePoddaniaSię(false) // resetowanie trwającego poddania się
	}

	function backspace() {
		if (wygranko != Wynik.GraWToku) {
			return // zablokuj usuwanie po wygranej/przegranej
		}
		setPotwierdzeniePoddaniaSię(false) // anuluj trwające poddanie się
		setPróby(mutacjaListy(numerPróby, próby[numerPróby].slice(0, -1))) // usuń ostatnią literkę
	}

	function enter() {
		if (wygranko != Wynik.GraWToku) {
			return // zablokuj enter po wygranej/przegranej
		}

		setPotwierdzeniePoddaniaSię(false) // anuluj trwające poddanie się

		const bieżąceSłowo = próby[numerPróby]

		if (bieżąceSłowo.length != długośćSłowa) {
			setTytułOkienka('Niewpisane słowo')
			setTreśćOkienka('Słowo jest za krótkie. Wpisz całe słowo.')
			setTrigerOkienka(!trigerOkienka)
			return
		}

		setZmianaTrybuTrudnego(false) // po pierwszym enterze nie można już zmienić trybu trudnego

		if (trybTrudny) {
			if (!listaSłów.includes(bieżąceSłowo)) {
				setTytułOkienka('Ograniczenie trybu trudnego')
				setTreśćOkienka('Nie ma takiego słowa.')
				setTrigerOkienka(!trigerOkienka)
				setPróby(mutacjaListy(numerPróby, '')) // anuluj próbę
				return // i przerwij dalsze przetwarzanie
			}
		}

		const nowyNumerPróby = numerPróby + 1 // przyda się numer kolejnej próby

		if (bieżąceSłowo == rozwiązanie) {
			setWygranko(Wynik.Wygranko)
			setZmianaTrybuTrudnego(true)
			setTytułOkienka('Wygranko')
			setTreśćOkienka('Gratulacje! Udało Ci się odgadnąć słowo.')
			setTrigerOkienka(!trigerOkienka)
			return
		}

		if (nowyNumerPróby == liczbaPrób) {
			// ...o tu się przyda
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
		setPotwierdzeniePoddaniaSię(false) // anuluj trwające poddanie się
		if (zmianaTrybuTrudnego) {
			setTrybTrudny(!trybTrudny)
		}
	}

	function dopiszLiterkę(literka: string) {
		setPotwierdzeniePoddaniaSię(false) // anuluj trwające poddanie się
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

		const bezOstatniej = próby[numerPróby].slice(0, długośćSłowa - 1) // taki slice:
		// utnie ostatnią literkę jeśli słowo ma długość równą długośćSłowa
		// albo zwróci całe słowo jeśli jest krótsze

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
	}, []) // ustaw fokus na div gry przy pierwszym renderze

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
				<label>
					<input
						type="checkbox"
						checked={trybCiemny}
						onChange={() => {
							setTrybCiemny(!trybCiemny)
						}}
					/>
					tryb ciemny
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
