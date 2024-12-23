import './Okienko.sass'

function Okienko(props: {
	tytuł?: string,
	tekst: string,
	refOkienka: React.RefObject<HTMLDialogElement | null>,
}) {
	function zamknij() {
		props.refOkienka.current?.close()
	}

	return <dialog className="okienko" ref={props.refOkienka}>
		{props.tytuł && <h2>{props.tytuł}</h2>}
		<p>{props.tekst}</p>
		<button onClick={zamknij}>OK</button>
	</dialog>
}

export default Okienko
