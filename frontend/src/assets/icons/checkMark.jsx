export default function CheckIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M53.9552 13.8572C54.9315 14.8336 54.9315 16.4164 53.9552 17.3928L25.6315 45.7167C24.6613 46.6867 23.0907 46.6937 22.1119 45.7325L5.74822 29.661C4.76317 28.6935 4.7489 27.1108 5.71637 26.1258C6.68385 25.1405 8.2667 25.1263 9.25177 26.0938L23.8478 40.4292L50.4198 13.8572C51.396 12.8809 52.979 12.8809 53.9552 13.8572Z"
                fill={fill} stroke="none"/>
        </svg>
    )
}