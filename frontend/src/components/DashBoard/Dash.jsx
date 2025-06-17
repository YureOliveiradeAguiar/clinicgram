import { ReactComponent as UserAddIcon } from '../../assets/icons/userAdd.svg'

import Card from './Card.jsx'

function Dash () {
    const cards = [
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
        { title: 'Registrar Cliente', Icon: UserAddIcon, link: '/register' },
    ];

    const styles = {
        dash: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
        },
    };
    return (
        <div style={styles.dash}>
            {cards.map((card, i) => (
                <Card key={i} {...card} />
            ))}
        </div>
    )
}

export default Dash