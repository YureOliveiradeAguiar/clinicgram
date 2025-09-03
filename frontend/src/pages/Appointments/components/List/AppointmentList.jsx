import styles from './QueueList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import QueueRegisterModal from '../RegisterModal/AppointmentRegisterModal';
import QueueDetailsModal from '../DetailsModal/AppointmentDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';


export default function QueueList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const { data: pendingAppointments,
        handleElementAdded,
        handleElementDelete,
        handleElementUpdate,
    } = useElement({ elementName: "a consulta", elementNamePlural: "as consultas", elementPath: "appointments",
        selectedElement: selectedAppointment, setSelectedElement: setSelectedAppointment,
        setStatusMessage, setOpenModal });


    return (
        <List title="Agendamentos"
                NewElementMessage="Nova" onNewElement={() => setOpenModal("register")}
                searchPlaceholder="Pesquisar por estagiário" searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            {pendingAppointments.length > 0 ? (
                pendingAppointments
                    .filter((queue) =>
                        queue.client.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(queue => (
                        <Card key={queue.id} element={queue} setOpenModal={setOpenModal} showStatistics={false}
                                selectedElement={selectedAppointment} setSelectedElement={setSelectedAppointment}>
                            <p className={styles.cardName} aria-label={queue.client.name}>
                                {queue.client.name}
                            </p>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhuma consulta na lista de espera'}</p>
            )}

            {openModal === "register" && (
                <QueueRegisterModal isOpen={openModal === "register"} onSuccess={handleElementAdded}
                        setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)} />
            )}
            {(openModal === "properties" && selectedAppointment) && (
                <QueueDetailsModal pendingAppointment={selectedAppointment} isOpen={selectedAppointment !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedAppointment(null); setOpenModal(null)}} onDelete={handleElementDelete} onUpdate={handleElementUpdate}/>
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}