import LogoImg from '@/assets/images/Logo.png';
import SidebarIcon from '@/assets/icons/sidebarIcon';
import styles from './Sidebar.module.css';

import { Link } from 'react-router-dom';
import { useState } from "react";

export default function Sidebar({ panelGroups, currentPath, setSidebarExpanded, sidebarExpanded }) {
	const [openDropdown, setOpenDropdown] = useState(null);
	const toggleDropdown = (id) => {
	  	setOpenDropdown(openDropdown === id ? null : id);
	};

	return (
		<div className={`${styles.sidePanel} ${!sidebarExpanded ? styles.retracted: ""}`}>
			<div className={`${styles.heading} ${!sidebarExpanded ? styles.retracted: ""}`}>
				{sidebarExpanded && (
					<div className={styles.brand}>
						<img className={styles.brandLogo} src={LogoImg} alt="Clinicgram" />
					</div>
				)}
				<button className={styles.panelButton} onClick={() => {
						setSidebarExpanded(prev => !prev);
						if (sidebarExpanded && openDropdown !== null) setOpenDropdown(null);}}>
					{sidebarExpanded ? (<>
						<SidebarIcon className={styles.icon} />
						<span className={styles.tooltip}>Fechar barra lateral</span>
					</>) : (<>
						<div className={styles.panelButtonIconWrapper}>
							<img className={`${styles.brandLogo} ${styles.default}`} src={LogoImg} alt="Clinicgram"/>
    					  	<SidebarIcon className={`${styles.icon} ${styles.hover}`} />
    					</div>
    					<span className={`${styles.tooltip} ${!sidebarExpanded ? styles.adapted : ""}`}>Abrir barra lateral</span>
					</>)}
				</button>
			</div>
			<div className={styles.panelOptions}>
				{panelGroups.map((group, groupIndex) => (
					<div key={groupIndex} className={styles.groupWrapper}>
						{sidebarExpanded && <div className={styles.groupTitle}>{group.title}</div>}
						{group.items.map((item, index) => {
							const { title, Icon, link } = item;
							const isActive = currentPath === link;
							return (
								<Link to={link} key={index} draggable={false}
									className={`${styles.panelOption} ${!sidebarExpanded ? styles.adapted : ""} ${isActive ? styles.activeOption : ""}`}>
									{Icon && <Icon className={styles.icon} />}
									{sidebarExpanded && <span className={styles.title}>{title}</span>}
									{!sidebarExpanded && <span className={`${styles.tooltip} ${styles.adapted}`}>{title}</span>}
								</Link>
							);
						})}
					</div>
				))}
			</div>
			<div onClick={() => setSidebarExpanded(prev => prev === false ? true : prev)} className={styles.filler}></div>
		</div>
	);
}

//if (dropdown) {
//	return (
//		<div key={index} className={styles.dropdown}>
//			<div className={`${styles.panelOption} ${!sidebarExpanded ? styles.adapted : ""} ${isActive ? styles.activeOption : ""}`}
//					onClick={() => {
//						toggleDropdown(title);
//						if (!sidebarExpanded) setSidebarExpanded(true);
//					}}>
//				{sidebarExpanded && <DropdownArrow className={`${styles.dropdownIcon} ${openDropdown===title ? styles.rightArrow : styles.downArrow}`} />}
//				{Icon && <Icon className={styles.icon} />}
//				{sidebarExpanded ? ( <span className={styles.title}>{title}</span>
//				) :
//				<span className={`${styles.tooltip} ${styles.adapted}`}>{title}</span>}
//			</div>
//
//			{openDropdown===title && (
//				<div className={styles.dropdownContent}>
//					<div className={styles.dropdownColumn} />
//					<div className={styles.dropdownOptions}>
//						{dropdown.map((subItem, subIndex) => (
//							<Link to={subItem.link} key={subIndex}
//								className={`${styles.panelSubOption} ${currentPath === subItem.link ? styles.activeOption : ""}`}>
//								{sidebarExpanded && <span className={styles.title}>{subItem.title}</span>}
//							</Link>
//						))}
//					</div>
//				</div>
//			)}
//		</div>
//	);
//}