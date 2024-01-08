import './Literka.sass'

function Literka(
	props: {
		literka?: string,
		klasa: string
		klik?: () => void
	}
) {
	const literka = props.literka || '';
	const klasy = 'literka ' + props.klasa;

	return <div className={klasy} onClick={props.klik}>
		{literka}
	</div>
}

export default Literka
