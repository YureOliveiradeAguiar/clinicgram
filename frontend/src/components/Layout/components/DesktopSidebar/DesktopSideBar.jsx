import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DesktopSidebar.module.css';

export default function DesktopSidebar({ panelOptions, currentPath, sidebarExpanded }) {
	return (
		<div className={styles.sidePanel}>
			{panelOptions.map(({ title, Icon, link }, index) => {
				const isActive = currentPath === link;
				return (
					<Link to={link} key={index} className={`${styles.panelOption} ${isActive ? styles.activeOption : ''}`}>
						{Icon && <Icon className={styles.icon} />}
						{sidebarExpanded && <span>{title}</span>}
					</Link>
				);
			})}
		</div>
	);
}