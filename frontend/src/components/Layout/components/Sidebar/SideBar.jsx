import ArrowDownIcon from '@/assets/icons/arrowDown';
import ArrowUpIcon from '@/assets/icons/arrowUp';
import LogoImg from '@/assets/images/Logo.png';
import ArrowRight from '@/assets/icons/arrowRight';
import ArrowLeft from '@/assets/icons/arrowLeft';
import styles from './Sidebar.module.css';

import { Link } from 'react-router-dom';
import { useState } from "react";

export default function Sidebar({ panelOptions, currentPath, setSidebarExpanded, sidebarExpanded }) {
	return (
		<div className={styles.sidePanel}>
			<div className={styles.heading}>
				<div className={styles.brand}>
					<img className={styles.brandLogo} src={LogoImg} alt="Clinicgram" />
				</div>
				<button className={styles.panelButton} onClick={() => setSidebarExpanded(prev => !prev)}>
					{sidebarExpanded ? (
						<ArrowLeft className={styles.icon} />
					) : (
						<ArrowRight className={styles.icon} />
					)}
				</button>
			</div>
			{panelOptions.map((item, index) => {
				const { title, Icon, link, dropdown } = item;
				const isActive = currentPath === link;

				if (dropdown) {
					const [isOpen, setIsOpen] = useState(false);
					return (
						<div key={index} className={styles.dropdown}>
							<div className={`${styles.panelOption} ${isActive ? styles.activeOption : ""}`}
									onClick={() => {
										setIsOpen(!isOpen);
										if (!sidebarExpanded) setSidebarExpanded(true);
									}}>
								<div className={styles.iconWithTitle}>
								{Icon && <Icon className={styles.icon} />}
									<span>{title}</span>
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
									<div className={styles.dropdownColumn}/>
									<div className={styles.dropdownOptions}>
										{dropdown.map((subItem, subIndex) => (
											<Link to={subItem.link} key={subIndex}
													className={`${styles.panelSubOption} ${currentPath === subItem.link ? styles.activeOption : ""}`}>
												<span>{subItem.title}</span>
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					);
				}
				return (
					<Link to={link} key={index} draggable={false} className={`${styles.panelOption} ${isActive ? styles.activeOption : ""}`}>
						<div className={styles.iconWithTitle}>
							{Icon && <Icon className={styles.icon} />}
							<span>{title}</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}