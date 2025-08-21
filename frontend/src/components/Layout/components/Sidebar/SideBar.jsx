import ArrowDownIcon from '@/assets/icons/arrowDown';
import ArrowUpIcon from '@/assets/icons/arrowUp';
import LogoImg from '@/assets/images/Logo.png';
import XIcon from '@/assets/icons/xIcon';
import styles from './Sidebar.module.css';

import { Link } from 'react-router-dom';
import { useState } from "react";

export default function Sidebar({ panelOptions, currentPath, setSidebarExpanded, sidebarExpanded }) {
	return (
		<div className={styles.sidePanel}>
			<div className={styles.heading}>
				<button className={styles.panelButton} onClick={() => setSidebarExpanded(prev => !prev)}>
					<XIcon className={styles.panelButtonIcon}/>
				</button>
				<div className={styles.brand}>
					<img src={LogoImg} alt="Clinicgram" />
					<h1>Clinicgram</h1>
				</div>
			</div>
			{panelOptions.map((item, index) => {
				const { title, Icon, link, dropdown } = item;
				const isActive = currentPath === link;

				if (dropdown) {
					const [isOpen, setIsOpen] = useState(false);
					return (
						<div key={index} className={styles.dropdown}>
							<div onClick={() => setIsOpen(!isOpen)} className={`${styles.panelOption} ${isActive ? styles.activeOption : ""}`}>
								<div className={styles.iconWithTitle}>
									{Icon && <Icon className={styles.icon} />}
									{sidebarExpanded && <span>{title}</span>}
								</div>
								{sidebarExpanded && (
									isOpen ? (
										<ArrowUpIcon className={styles.icon} />
									) : (
										<ArrowDownIcon className={styles.icon} />
									)
								)}
							</div>

							{isOpen && (
								<div className={styles.dropdownContent}>
									{dropdown.map((subItem, subIndex) => (
										<Link to={subItem.link} key={subIndex}
												className={`${styles.panelSubOption} ${currentPath === subItem.link ? styles.activeOption : ""}`}>
											<span>{subItem.title}</span>
										</Link>
									))}
								</div>
							)}
						</div>
					);
				}
				return (
					<Link to={link} key={index} className={`${styles.panelOption} ${isActive ? styles.activeOption : ""}`}>
						<div className={styles.iconWithTitle}>
							{Icon && <Icon className={styles.icon} />}
							{sidebarExpanded && <span>{title}</span>}
						</div>
					</Link>
				);
			})}
		</div>
	);
}