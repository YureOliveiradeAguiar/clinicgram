export default function ArrowLeft ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M36.7678 10.7322C37.7441 11.7086 37.7441 13.2914 36.7678 14.2678L21.0355 30L36.7678 45.7323C37.7441 46.7085 37.7441 48.2915 36.7678 49.2677C35.7914 50.244 34.2085 50.244 33.2322 49.2677L15.7323 31.7677C14.756 30.7915 14.756 29.2085 15.7323 28.2323L33.2322 10.7322C34.2085 9.75593 35.7914 9.75593 36.7678 10.7322Z"
                fill={fill} stroke="none"/>
        </svg>
    )
}