import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileDrawer.module.css';

export default function MobileDrawer({ panelOptions, currentPath, isOpen, onClose }) {
	return (
		<>
			{isOpen && <div className={styles.overlay} onClick={onClose} />}
			<div className={`${styles.sidePanel} ${isOpen ? styles.open : ''}`}>
				{panelOptions.map(({ title, Icon, link }, index) => {
					const isActive = currentPath === link;
					return (
						<Link
							to={link}
							key={index}
							className={`${styles.panelOption} ${isActive ? styles.activeOption : ''}`}
							onClick={onClose}
						>
							{Icon && <Icon className={styles.icon} />}
							<span>{title}</span>
						</Link>
					);
				})}
			</div>
		</>
	);
}