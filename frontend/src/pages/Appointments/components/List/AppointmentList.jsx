import CalendarIcon from '@/assets/icons/calendarIcon';
import styles from './AppointmentList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import AppointmentRegisterModal from '../RegisterModal/AppointmentRegisterModal';
import AppointmentDetailsModal from '../DetailsModal/AppointmentDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';
import useFetch from './hooks/useFetch';


export default function AppointmentList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const { data: appointments,
        handleElementAdded,
        handleElementDelete,
        handleElementUpdate,
    } = useElement({ elementName:"a consulta", elementNamePlural:"as consultas", elementPath:"appointments",
        selectedElement:selectedAppointment, setSelectedElement:setSelectedAppointment,
        setStatusMessage, setOpenModal });

    // I put the fetches here, so the modals can use them without having to re-render the fetches.
    const { data: treatments} = useFetch({ elementNamePlural:'os procedimentos', elementPath:'treatments', setStatusMessage});
    const { data: clients} = useFetch({ elementNamePlural:'os pacientes', elementPath:'clients', setStatusMessage});
    const { data: workers} = useFetch({ elementNamePlural:'os estagiários', elementPath:'workers', setStatusMessage});
    const { data: places} = useFetch({ elementNamePlural:'as salas', elementPath:'places', setStatusMessage});

    return (
        <List title="Agendamentos"
                NewElementMessage="Nova" onNewElement={() => setOpenModal("register")}
                searchPlaceholder="Pesquisar por estagiário" searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            {appointments.length > 0 ? (
                appointments
                    .filter((appointment) =>
                        appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => b.priority - a.priority)
                    .map(appointment => (
                        <Card key={appointment.id} element={appointment} setOpenModal={setOpenModal} secondButtonIcon={CalendarIcon}
                                selectedElement={selectedAppointment} setSelectedElement={setSelectedAppointment}>
                            <p className={`${styles.cardAtribute} ${styles.priority}`}>
                                Prioridade: {appointment.priority}
                            </p>
                            <p className={`${styles.cardAtribute} ${styles.status}`}>
                                {appointment.status_display}
                            </p>
                            <p className={`${styles.cardAtribute} ${styles.client}`}>
                                {appointment.client.name}
                            </p>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhuma consulta na lista de espera'}</p>
            )}

            {openModal === "register" && (
                <AppointmentRegisterModal isOpen={openModal === "register"} onSuccess={handleElementAdded}
                    treatments={treatments} clients={clients} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => setOpenModal(null)}
                    appointments={appointments}
                />
            )}
            {(openModal === "properties" && selectedAppointment) && (
                <AppointmentDetailsModal isOpen={openModal === "properties" && selectedAppointment !== null}
                    appointment={selectedAppointment} setAppointment={setSelectedAppointment} 
                    treatments={treatments} clients={clients} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => {setSelectedAppointment(null); setOpenModal(null)}}
                    onDelete={handleElementDelete} onUpdate={handleElementUpdate}
                    appointments={appointments}
                />
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}