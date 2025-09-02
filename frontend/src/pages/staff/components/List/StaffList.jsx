import PersonAddIcon from '@/assets/icons/personAddIcon';
import styles from './StaffList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import StaffRegisterModal from '../RegisterModal/StaffRegisterModal';
import StaffStatisticsModal from '../StatisticsModal/StaffStatisticsModal';
import StaffDetailsModal from '../DetailsModal/StaffDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';


export default function StaffList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const { data: staffs,
        handleElementAdded,
        handleElementDelete,
        handleElementUpdate,
    } = useElement({ elementName: "o estagiário", elementNamePlural: "os estagiários", elementPath: "staff",
        selectedElement: selectedStaff, setSelectedElement: setSelectedStaff,
        setStatusMessage, setOpenModal });


    return (
        <List title="Estagiários"
                NewElementIcon={PersonAddIcon} NewElementMessage="Novo" onNewElement={() => setOpenModal("register")}
                searchPlaceholder="Pesquisar estagiário" searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            {staffs.length > 0 ? (
                staffs
                    .filter((staff) =>
                        staff.username.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(staff => (
                        <Card key={staff.id} element={staff} setOpenModal={setOpenModal}
                                selectedElement={selectedStaff} setSelectedElement={setSelectedStaff}>
                            <p className={styles.cardName} aria-label={staff.username}>
                                {staff.username}
                            </p>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhum estagiário registrado'}</p>
            )}

            {openModal === "register" && (
                <StaffRegisterModal isOpen={openModal === "register"} onSuccess={handleElementAdded}
                        setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)} />
            )}
            {(openModal === "statistics" && selectedStaff) && (
                <StaffStatisticsModal staff={selectedStaff} isOpen={selectedStaff !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedStaff(null); setOpenModal(null)}} onDelete={handleElementDelete} onUpdate={handleElementUpdate}/>
            )}
            {(openModal === "properties" && selectedStaff) && (
                <StaffDetailsModal staff={selectedStaff} isOpen={selectedStaff !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedStaff(null); setOpenModal(null)}} onDelete={handleElementDelete} onUpdate={handleElementUpdate}/>
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}