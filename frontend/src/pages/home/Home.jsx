import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import Banner from './components/Banner/Banner.jsx'
import About from './components/About/About.jsx'
import Advantages from './components/Advantages/Advantages.jsx'
import Contact from './components/Contact/Contact.jsx'
import Footer from './components/Footer/Footer.jsx'

export default function Home() {
	return(
        <>
			<Header/>
            <main style={{borderRadius:"0px"}}>
		    	<Hero/>
		    	<Banner/>
		    	<About/>
		    	<Advantages/>
		    	<Contact/>
		    </main>
		    <Footer/>
        </>
	);
}