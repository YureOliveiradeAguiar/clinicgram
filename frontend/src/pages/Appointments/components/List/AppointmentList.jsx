import CalendarIcon from '@/assets/icons/calendarIcon';
import styles from './AppointmentList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import AppointmentRegisterModal from '../RegisterModal/AppointmentRegisterModal';
import AppointmentDetailsModal from '../DetailsModal/AppointmentDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';
import useFetch from '@/hooks/useFetch';


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

//============================Fetches for the modals, so they can use them without having to re-render the fetches===================
    const { data: treatments} = useFetch({ elementNamePlural:'os procedimentos', elementPath:'treatments', setStatusMessage});
    const { data: clients} = useFetch({ elementNamePlural:'os pacientes', elementPath:'clients', setStatusMessage});
    const { data: workers} = useFetch({ elementNamePlural:'os estagiários', elementPath:'workers', setStatusMessage});
    const { data: places} = useFetch({ elementNamePlural:'as salas', elementPath:'places', setStatusMessage});

//========================================Getting relative time for display in appointment cards=====================================
    function getRelativeTime(date) {
        const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
        const diffMs = date.getTime() - Date.now();
        const diffSec = Math.round(diffMs / 1000);
        const divisions = [
            { amount: 60, name: "second" },
            { amount: 60, name: "minute" },
            { amount: 24, name: "hour" },
            { amount: 30, name: "day" },
            { amount: 12, name: "month" },
            { amount: Number.POSITIVE_INFINITY, name: "year" },
        ];
        let unit = "second";
        let value = diffSec;
        for (const division of divisions) {
            if (Math.abs(value) < division.amount) break;
            value = Math.round(value / division.amount);
            unit = division.name;
        }
        return rtf.format(value, unit);
    }
//===================================================================================================================================

    return (
        <List title="Consultas" NewElementMessage="Nova" onNewElement={() => setOpenModal("register")}
            searchPlaceholder="Pesquisar por paciente" searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        >
            {appointments.length > 0 ? (
                appointments
                    .filter((appointment) =>
                        appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => b.priority - a.priority)
                    .map(appointment => (
                        <Card key={appointment.id} element={appointment} setOpenModal={setOpenModal} showSecondButton={false}
                            selectedElement={selectedAppointment} setSelectedElement={setSelectedAppointment}
                        >
                            <div className={styles.mainGroup}>
                                <p className={styles.priority}>Prioridade {appointment.priority}</p>
                                <div className={styles.centerInfo}>
                                    <p>{appointment.client.name}</p>
                                    <p className={`${styles.status} ${styles[appointment.status]}`}>
                                        {appointment.statusDisplay}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.dateInfo}>
                                <span>
                                    <CalendarIcon className='icon'/>
                                    {appointment.startTime ? (<>
                                        {getRelativeTime(new Date(appointment.startTime))}
                                    </>) : "-/-"}
                                </span>
                                <span>criado {getRelativeTime(new Date(appointment.createdAt))}</span>
                            </div>
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