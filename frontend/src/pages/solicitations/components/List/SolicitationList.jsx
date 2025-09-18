import CalendarAddIcon from '@/assets/icons/calendarAddIcon';
import SolicitateIcon from '@/assets/icons/solicitateIcon';
import CalendarIcon from '@/assets/icons/calendarIcon';
import PersonIcon from '@/assets/icons/personIcon';
import MedicalInfo from '@/assets/icons/medicalInfo';
import styles from './SolicitationList.module.css'

import List from '@/components/List/List.jsx';
import Card from '@/components/Card/Card.jsx';
import ReservationRegisterModal from '@/pages/appointments/reservation/RegisterModal/ReservationRegisterModal';
import ReservationDetailsModal from '@/pages/appointments/reservation/DetailsModal/ReservationDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';
import useFetch from '@/hooks/useFetch';

import getRelativeTime from '@/utils/getRelativeTime';


export default function SolicitationList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const { data: appointments,
        handleElementAdded,
        handleElementDelete,
        handleElementUpdate,
    } = useElement({ elementName: "a solicitação", elementNamePlural: "as solicitações", elementPath: "appointments",
        selectedElement: selectedAppointment, setSelectedElement: setSelectedAppointment,
        setStatusMessage, setOpenModal });

//============================Fetches for the modals, so they can use them without having to re-render the fetches===================
    const { data: treatments} = useFetch({ elementNamePlural:'os procedimentos', elementPath:'treatments', setStatusMessage});
    const { data: clients} = useFetch({ elementNamePlural:'os pacientes', elementPath:'clients', setStatusMessage});
    const { data: workers} = useFetch({ elementNamePlural:'os estagiários', elementPath:'workers', setStatusMessage});
    const { data: places} = useFetch({ elementNamePlural:'as salas', elementPath:'places', setStatusMessage});

//==============================================================================================================================

    return (
        <List title="Solicitações"
            NewElementIcon={CalendarAddIcon} NewElementMessage="Criar" onNewElement={() => setOpenModal("registerReservation")}
            searchPlaceholder="Pesquisar por estagiário" searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        >
            {appointments.length > 0 ? (
                appointments
                    .filter((appointment) =>
                        appointment.status === "reservation" &&
                        appointment.worker.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(appointment => (
                        <Card key={appointment.id} element={appointment} setOpenModal={setOpenModal}
                            selectedElement={selectedAppointment} setSelectedElement={setSelectedAppointment}
                            secondButtonIcon={SolicitateIcon} customSpecifier={`${appointment.status==="reservation" ? "reservation" : "appointment"}`}
                        >
                            <div className={styles.mainGroup}>
                                <div className={styles.infoGroup}>
                                    <p className={`${styles.status} ${styles[appointment.status]}`}>{appointment.statusDisplay}</p>
                                    <p className={styles.priority}>Prioridade {appointment.priority}</p>
                                </div>
                                <div className={styles.infoGroup}>
                                    <p><PersonIcon className={styles.icon} />{appointment.client ? appointment.client.name : "---"}</p>
                                    <p><MedicalInfo className={styles.icon} />{appointment.worker.name}</p>
                                </div>
                            </div>
                            <div className={styles.dateInfo}>
                                <span>
                                    <CalendarIcon className='icon' />
                                    {appointment.startTime ? (<>
                                        {getRelativeTime(new Date(appointment.startTime))}
                                    </>) : "---"}
                                </span>
                                <span>criado {getRelativeTime(new Date(appointment.createdAt))}</span>
                            </div>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhum tratamento encontrado'}</p>
            )}

            {openModal === "registerReservation" && (
                <ReservationRegisterModal isOpen={openModal === "registerAppointment"} onSuccess={handleElementAdded}
                    treatments={treatments} clients={clients} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => setOpenModal(null)}
                    appointments={appointments}
                />
            )}
            {(openModal === "reservationProperties" && selectedAppointment) && (
                <ReservationDetailsModal isOpen={openModal === "appointmentProperties" && selectedAppointment !== null}
                    appointment={selectedAppointment} setAppointment={setSelectedAppointment}
                    treatments={treatments} clients={clients} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => { setSelectedAppointment(null); setOpenModal(null) }}
                    onDelete={handleElementDelete} onUpdate={handleElementUpdate}
                    appointments={appointments}
                />
            )}
            {(openModal === "solicitationProperties" && selectedAppointment) && (
                <ReservationDetailsModal isOpen={openModal === "appointmentProperties" && selectedAppointment !== null}
                    appointment={selectedAppointment} setAppointment={setSelectedAppointment}
                    treatments={treatments} clients={clients} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => { setSelectedAppointment(null); setOpenModal(null) }}
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