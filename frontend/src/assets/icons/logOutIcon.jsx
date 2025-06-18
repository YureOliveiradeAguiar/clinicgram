function logOutIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M30 37.5L37.5 30M37.5 30L30 22.5M37.5 30H10M22.5 18.1215V18.0005C22.5 15.2002 22.5 13.7991 23.045 12.7295C23.5243 11.7887 24.2887 11.0243 25.2295 10.545C26.299 10 27.7003 10 30.5005 10H42.0005C44.8007 10 46.199 10 47.2685 10.545C48.2093 11.0243 48.9762 11.7887 49.4555 12.7295C50 13.798 50 15.1975 50 17.9923V42.009C50 44.8038 50 46.2012 49.4555 47.2697C48.9762 48.2105 48.2093 48.9762 47.2685 49.4555C46.2 50 44.8025 50 42.0078 50H30.4923C27.6975 50 26.298 50 25.2295 49.4555C24.2887 48.9762 23.5243 48.2098 23.045 47.269C22.5 46.1995 22.5 44.8002 22.5 42V41.875"
                stroke={fill} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default logOutIcon;