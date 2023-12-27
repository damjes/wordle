import './Literka.scss'

function Literka(
	props: {
		literka?: string,
		klasa: string
	}
) {
	const literka = props.literka || '';
	const klasy = 'literka ' + props.klasa;

	return <div className={klasy}>
		{literka}
	</div>
}

export default Literka
