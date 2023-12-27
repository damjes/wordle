import Slowo from "./Slowo"

function Gra() {
	return <div className="gra">
		<Slowo słowo="ebafe" rozwiązanie="abcde" etap="po" />
		<Slowo słowo="abcde" rozwiązanie="abcde" etap="po" />
		<Slowo słowo="ab" rozwiązanie="abcde" etap="teraz" />
		<Slowo rozwiązanie="abcde" etap="przed" />
	</div>
}

export default Gra
