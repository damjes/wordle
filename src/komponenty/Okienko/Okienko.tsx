import './Okienko.sass'
import './ciemny.sass'

function Okienko(props: {
	tytuł?: string
	tekst: string
	refOkienka: React.RefObject<HTMLDialogElement | null>
}) {
	/* eslint-disable react-hooks/refs */
	// bez tego eslint piłuje mordę, że rzekomo korzystam z propsów przy renderowaniu komponentu, ale to wreżala
	// korzystam raz do ustawienia refa, ale NB https://react.dev/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes

	function zamknij() {
		props.refOkienka.current?.close()
	}

	return (
		<dialog className="okienko" ref={props.refOkienka}>
			{props.tytuł && <h2>{props.tytuł}</h2>}
			<p>{props.tekst}</p>
			<button onClick={zamknij}>OK</button>
		</dialog>
	)
}

export default Okienko
