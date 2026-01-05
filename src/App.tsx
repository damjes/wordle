import GithubCorner from './komponenty/GithubCorner/GithubCorner'
import Gra from './komponenty/Gra/Gra'

function App() {
	return (
		<>
			<GithubCorner
				href="https://github.com/damjes/wordle/"
				ariaLabel="Czytaj kod źródłowy na GitHub"
			/>
			<h1>Damjesowe Wordle</h1>
			<Gra />
		</>
	)
}

export default App
