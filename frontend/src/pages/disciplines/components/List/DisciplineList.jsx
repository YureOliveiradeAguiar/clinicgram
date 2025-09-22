import styles from './DisciplineList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import DisciplineRegisterModal from '../RegisterModal/DisciplineRegisterModal';
import DisciplineDetailsModal from '../DetailsModal/DisciplineDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';


export default function DisciplineList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);

    const { data: disciplines,
        handleElementAdded: handleDisciplineAdded,
        handleElementDelete : handleDisciplineDelete,
        handleElementUpdate : handleDisciplineUpdate,
    } = useElement({ elementName: "a sala", elementNamePlural: "as salas", elementPath: "disciplines",
        selectedElement: selectedDiscipline, setSelectedElement: setSelectedDiscipline,
        setStatusMessage, setOpenModal });


    return (
        <List title="Salas"
            NewElementMessage="Nova" onNewElement={() => setOpenModal("register")}
            searchPlaceholder="Pesquisar disciplina" searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        >
            {disciplines.length > 0 ? (
                disciplines
                    .filter((discipline) =>
                        discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(discipline => (
                        <Card key={discipline.id} element={discipline} setOpenModal={setOpenModal} showSecondButton={false}
                            selectedElement={selectedDiscipline} setSelectedElement={setSelectedDiscipline}
                        >
                            <div className={styles.cardName}>
                                <span>{discipline.icon}</span>
                                <span>{discipline.name}</span>
                            </div>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhuma sala registrada'}</p>
            )}

            {openModal === "register" && (
                <DisciplineRegisterModal isOpen={openModal === "register"} onSuccess={handleDisciplineAdded}
                        setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)} />
            )}
            {(openModal === "properties" && selectedDiscipline) && (
                <DisciplineDetailsModal discipline={selectedDiscipline} isOpen={selectedDiscipline !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedDiscipline(null); setOpenModal(null)}} onDelete={handleDisciplineDelete} onUpdate={handleDisciplineUpdate}/>
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}