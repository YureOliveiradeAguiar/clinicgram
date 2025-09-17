import CalendarIcon from '@/assets/icons/calendarIcon';
import PersonIcon from '@/assets/icons/personIcon';
import MedicalInfo from '@/assets/icons/medicalInfo';
import styles from './AppointmentList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card';
import AppointmentRegisterModal from '../appointment/RegisterModal/AppointmentRegisterModal';
import AppointmentDetailsModal from '../appointment/DetailsModal/AppointmentDetailsModal';
import ReservationRegisterModal from '../reservation/RegisterModal/ReservationRegisterModal';
import ReservationDetailsModal from '../reservation/DetailsModal/ReservationDetailsModal';

import { useState, useEffect, useRef } from 'react';

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
    const getRelativeTime = (date) => {
        const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto", style: "short" });
        const diffMs = date.getTime() - Date.now();

        const divisions = [
            { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
            { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
            { unit: "day", ms: 1000 * 60 * 60 * 24 },
            { unit: "hour", ms: 1000 * 60 * 60 },
            { unit: "minute", ms: 1000 * 60 },
            { unit: "second", ms: 1000 },
        ];

        for (const { unit, ms } of divisions) {
            if (Math.abs(diffMs) >= ms || unit === "second") {
                return rtf.format(Math.round(diffMs / ms), unit);
            }
        }
    }

//================================================New Element Selection Logic===================================================
    const [isNewElementMenuOpen, setIsNewElementMenuOpen] = useState(false);
    const newElementOptions = [
        {
            title: "Consulta",
            onClick: () => { setOpenModal("registerAppointment"); setIsNewElementMenuOpen(false); },
        },
        {
            title: "Reserva",
            onClick: () => { setOpenModal("registerReservation"); setIsNewElementMenuOpen(false); },
        },
    ];
    /* Closes on outside click */
    const menuRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsNewElementMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

//==============================================================================================================================

    return (
        <List title="Consultas"
            NewElementMessage="Criar" onNewElement={() => setIsNewElementMenuOpen(prev => !prev)} ref={menuRef}
            searchPlaceholder="Pesquisar por estagiário" searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            newIsDropdown={true} isNewElementMenuOpen={isNewElementMenuOpen} newElementOptions={newElementOptions}
        >
            {appointments.length > 0 ? (
                appointments
                    .filter((appointment) =>
                        appointment.worker.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .map(appointment => (
                        <Card key={appointment.id} element={appointment} setOpenModal={setOpenModal} 
                            selectedElement={selectedAppointment} setSelectedElement={setSelectedAppointment}
                            showSecondButton={false} customSpecifier={`${appointment.status==="reservation" ? "reservation" : "appointment"}`}
                        >
                            <div className={styles.mainGroup}>
                                <div className={styles.infoGroup}>
                                    <p className={`${styles.status} ${styles[appointment.status]}`}>{appointment.statusDisplay}</p>
                                    <p className={styles.priority}>Prioridade {appointment.priority}</p>
                                </div>
                                <div className={styles.infoGroup}>
                                    <p><PersonIcon className={styles.icon}/>{appointment.client ? appointment.client.name : "---"}</p>
                                    <p><MedicalInfo className={styles.icon}/>{appointment.worker.name}</p>
                                </div>
                            </div>
                            <div className={styles.dateInfo}>
                                <span>
                                    <CalendarIcon className='icon'/>
                                    {appointment.startTime ? (<>
                                        {getRelativeTime(new Date(appointment.startTime))}
                                    </>) : "---"}
                                </span>
                                <span>criado {getRelativeTime(new Date(appointment.createdAt))}</span>
                            </div>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhuma consulta na lista de espera'}</p>
            )}

            {openModal === "registerAppointment" && (
                <AppointmentRegisterModal isOpen={openModal === "registerAppointment"} onSuccess={handleElementAdded}
                    treatments={treatments} clients={clients} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => setOpenModal(null)}
                    appointments={appointments}
                />
            )}
            {(openModal === "appointmentProperties" && selectedAppointment) && (
                <AppointmentDetailsModal isOpen={openModal === "appointmentProperties" && selectedAppointment !== null}
                    appointment={selectedAppointment} setAppointment={setSelectedAppointment} 
                    treatments={treatments} clients={clients} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => {setSelectedAppointment(null); setOpenModal(null)}}
                    onDelete={handleElementDelete} onUpdate={handleElementUpdate}
                    appointments={appointments}
                />
            )}
            {openModal === "registerReservation" && (
                <ReservationRegisterModal isOpen={openModal === "registerReservation"} onSuccess={handleElementAdded}
                    treatments={treatments} workers={workers} places={places}
                    setStatusMessage={setStatusMessage} onClose={() => setOpenModal(null)}
                    appointments={appointments}
                />
            )}
            {(openModal === "reservationProperties" && selectedAppointment) && (
                <ReservationDetailsModal isOpen={openModal === "appointmentProperties" && selectedAppointment !== null}
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