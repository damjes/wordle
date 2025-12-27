import './Literka.sass'
import './ciemny.sass'

function Literka(props: {
	literka?: string
	klasa: string
	klik?: () => void
}) {
	const literka = props.literka || '' // literka może być pusta dla niewypełnionych miejsc (w przyszłych próbach)
	const klasy = 'literka ' + props.klasa

	return (
		<div
			className={klasy}
			onClick={props.klik}
			aria-label={props.klik ? literka : undefined} // jeżeli literka jest klikalna (ma onClicka), dodajemy etykietę dla czytników ekranu
		>
			{literka}
		</div>
	)
}

export default Literka
