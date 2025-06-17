function UserAddIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M50 45H42.5M42.5 45H35M42.5 45V37.5M42.5 45V52.5M27.5 52.5H10C10 42.835 17.835 35 27.5 35C29.2375 35 30.9157 35.2532 32.5 35.7247M37.5 17.5C37.5 23.0229 33.0228 27.5 27.5 27.5C21.9771 27.5 17.5 23.0229 17.5 17.5C17.5 11.9771 21.9771 7.5 27.5 7.5C33.0228 7.5 37.5 11.9771 37.5 17.5Z"
                stroke={fill} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default UserAddIcon;