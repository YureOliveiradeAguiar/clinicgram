export default function ArrowRight ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M23.2322 49.2678C22.2559 48.2914 22.2559 46.7086 23.2322 45.7322L38.9645 30L23.2322 14.2677C22.2559 13.2915 22.2559 11.7085 23.2322 10.7323C24.2086 9.756 25.7915 9.756 26.7678 10.7323L44.2677 28.2323C45.244 29.2085 45.244 30.7915 44.2677 31.7677L26.7678 49.2678C25.7915 50.2441 24.2086 50.2441 23.2322 49.2678Z"
                fill={fill} stroke="none"/>
        </svg>
    )
}