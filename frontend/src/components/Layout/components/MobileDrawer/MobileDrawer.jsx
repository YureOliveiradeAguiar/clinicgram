import LogoImg from '@/assets/images/Logo.png'
import XIcon from '@/assets/icons/xIcon';
import styles from './MobileDrawer.module.css';

import { Link } from 'react-router-dom';

export default function MobileDrawer({ panelOptions, currentPath, isOpen, onClose }) {
	return (
		<>
			{isOpen && (
				<div className={styles.overlay} onClick={onClose}></div>
			)}
			<div className={`${styles.sidePanel} ${isOpen ? styles.open : ''}`}>
				<div className={styles.heading}>
					<button className={styles.panelButton} onClick={onClose}>
						<XIcon className={styles.panelButtonIcon}/>
					</button>
					<div className={styles.brand}>
						<img src={LogoImg} alt="Clinicgram" />
						<h1>Clinicgram</h1>
					</div>
				</div>
				<div className={styles.optionsList}>
					{panelOptions.map(({ title, Icon, link }, index) => {
						const isActive = currentPath === link;
						return (
							<Link to={link} key={index} className={`${styles.panelOption} ${isActive ? styles.activeOption : ''}`} onClick={onClose}>
								{Icon && <Icon className={styles.icon} />}
								<span>{title}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</>
	);
}