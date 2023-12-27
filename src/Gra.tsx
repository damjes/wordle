import Slowo from "./Slowo"

function Gra() {
	return <div className="gra">
		<Slowo słowo="ebafe" rozwiązanie="abcde" wpisujeTeraz={false} />
		<Slowo słowo="abcde" rozwiązanie="abcde" wpisujeTeraz={true} />
		<Slowo słowo="ab" rozwiązanie="abcde" wpisujeTeraz={true} />
	</div>
}

export default Gra
