import Footer from '@/components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import Banner from './components/Banner/Banner.jsx'
import About from './components/About/About.jsx'
import Advantages from './components/Advantages/Advantages.jsx'
import Contact from './components/Contact/Contact.jsx'

function Home() {
	return(
        <>
            <main>
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

export default Home