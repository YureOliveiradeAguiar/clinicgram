import Slide1 from '../../assets/images/ClFisio.png'
import Slide2 from '../../assets/images/ClDent.png'
import Slide3 from '../../assets/images/ClOftomo.png'
import React, {useState , useEffect, useRef} from "react";
import styles from './Carousel.module.css'

function Carousel () {
    const containerRef = useRef(null); // Slides ref container.
    const intervalRef = useRef(null); // Ref container for both a JS interval and a function associated to it.

    const [activeIndex, setActiveIndex] = useState(0);

	const slidesRef = useRef([]);
	const slideCountRef = useRef(0);

	useEffect ( () => {
		const slides = containerRef.current.querySelectorAll(`.${styles.slide}`);
		slidesRef.current = slides;
		slideCountRef.current = slides.length;

		showSlide(0);
      	startAutoSlide();
		
      	return () => clearInterval(intervalRef.current);
	}, [] ); // [] Applies when component is mounted.

    const showSlide = (index) => {
		const slideCount = slideCountRef.current;

      	const boundedIndex = (index + slideCount) % slideCount;
        setActiveIndex(boundedIndex);
        
        //console.log("boundedIndex", boundedIndex);
        //console.log("activeIndex", activeIndex);
    };
	const startAutoSlide = () => {
      	intervalRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % slideCountRef.current);
        }, 3000);
    };
    const moveSlide = (step) => {
      	resetTimer();
        showSlide(activeIndex + step);
    };
    const resetTimer = () => {
      	clearInterval(intervalRef.current);
      	startAutoSlide();
    };

    const slidesDivs = [
        { id: 1, content:
            <>
                <img src={Slide1} alt="Clínica Fisioterápica - Una, Sete Lagoas"/>
                <p>Clínica Fisioterápica</p>
            </> },
        { id: 2, content:
            <>
                <img src={Slide2} alt="Clínica Dentária - Una, Sete Lagoas"/>
                <p>Clínica Dentária</p>
            </> },
        { id: 3, content:
            <>
                <img src={Slide3} alt="Sala de Optometria - Una, Sete Lagoas"/>
                <p>Sala de Optometria</p>
            </> },
    ];

    // Dots creation and interactivity.
    const handleDotClick = (i) => {
        resetTimer();
        setActiveIndex(i);
        //console.log("i: ", i);
        //console.log("activeIndexRef.current: ", activeIndexRef.current);
    };

    return (
        <div ref={containerRef} className={styles.carousel}>
            <div className={styles.carouselInner}>
                {/* For every slide div, render it to the real DOM. */}
                {slidesDivs.map((slide, i) => (
                    <div key={slide.id} className={`${styles.slide} ${i === activeIndex ? styles.activeSlide : ''}`}>
                        {slide.content}
                        <h5>Una, Sete Lagoas</h5>
                        <button onClick={() => navigate('/login')} className={styles.apointmentButton}>Agendar agora</button>
                    </div>
                ))}
            </div>
            <div className={styles.dotsContainer}>
                {/* For every slide div, render a corresponding dot in the real DOM. */}
                {slidesDivs.map((slide, i) => (
                    <span key={i} className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
                    onClick={() => handleDotClick(i)}/>
                ))}
            </div>
        </div>
    )
}

export default Carousel