import Header from './Header/Header.jsx'
import Footer from './Footer.jsx'
import Hero from './Hero/Hero.jsx'
import Banner from './Banner/Banner.jsx'
import About from './About/About.jsx'

function App() {
	return(
		<>
			<Header/>
			<main>
				<Hero/>
				<Banner/>
				<About/>
			</main>
			<Footer/>
		</>
	);
}

export default App