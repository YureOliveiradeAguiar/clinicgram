export default function UsersIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M32.5 50V45C32.5 38.0965 26.9035 32.5 20 32.5C13.0964 32.5 7.5 38.0965 7.5 45V50H32.5ZM32.5 50H52.5V47.5C52.5 40.1363 46.9035 35 40 35C36.4667 35 33.2757 36.5637 31.0022 39.0777M27.5 17.5C27.5 21.6421 24.1421 25 20 25C15.8579 25 12.5 21.6421 12.5 17.5C12.5 13.3579 15.8579 10 20 10C24.1421 10 27.5 13.3579 27.5 17.5ZM45 22.5C45 25.2615 42.7615 27.5 40 27.5C37.2385 27.5 35 25.2615 35 22.5C35 19.7386 37.2385 17.5 40 17.5C42.7615 17.5 45 19.7386 45 22.5Z"
                stroke={fill} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}