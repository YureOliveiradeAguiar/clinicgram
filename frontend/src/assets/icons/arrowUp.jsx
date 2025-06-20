function arrowUpIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M49.2678 39.2678C48.2914 40.2441 46.7086 40.2441 45.7322 39.2678L30 23.5355L14.2677 39.2678C13.2915 40.2441 11.7085 40.2441 10.7323 39.2678C9.756 38.2914 9.756 36.7085 10.7323 35.7322L28.2323 18.2323C29.2085 17.256 30.7915 17.256 31.7677 18.2323L49.2678 35.7322C50.2441 36.7085 50.2441 38.2914 49.2678 39.2678Z"
                fill={fill} stroke={fill}/>
        </svg>
    )
}

export default arrowUpIcon;