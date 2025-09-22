import ProfileCircle from '@/assets/icons/profileCircle';
import LogOutIcon from '@/assets/icons/logOutIcon';

import styles from "./ProfileMenu.module.css";

import { useState, useRef, useEffect } from "react";

import handleLogout from '@/utils/handleLogout.js'

export default function ProfileMenu({ user }) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className={styles.profileContainer} ref={menuRef}>
			<div className={styles.userIconContainer} onClick={() => setIsOpen(!isOpen)}>
				<ProfileCircle className={styles.userIcon}/>
			</div>
			{isOpen && (
				<div className={styles.dropdown}>
					<div className={styles.userInfoSection}>
						<ProfileCircle className={styles.userIcon}/>
						<div className={styles.userInfo}>
							<span>{user?.username || 'Admin'}</span>
							<span className={styles.email}>{user?.email}</span>
						</div>
					</div>
					<a className={styles.dropdownItem} onClick={handleLogout} >
						{LogOutIcon && <LogOutIcon className={styles.icon}/>}
						<span>Sair</span>
					</a>
				</div>
			)}
		</div>
	);
}