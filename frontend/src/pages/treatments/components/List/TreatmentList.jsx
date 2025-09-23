import PlacesIcon from '@/assets/icons/placesIcon';
import styles from './TreatmentList.module.css'

import List from '@/components/List/List.jsx';
import Card from '@/components/Card/Card.jsx';
import TreatmentRegisterModal from '../RegisterModal/TreatmentRegisterModal.jsx';
import TreatmentDetailsModal from '../DetailsModal/TreatmentDetailsModal.jsx';

import { useState, useMemo } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';
import useFetch from '@/hooks/useFetch';


export default function TreatmentList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    const { data: treatments,
        handleElementAdded: handleTreatmentAdded,
        handleElementDelete : handleTreatmentDelete,
        handleElementUpdate : handleTreatmentUpdate,
    } = useElement({ elementName: "o tratamento", elementNamePlural: "os tratamentos", elementPath: "treatments",
        selectedElement: selectedTreatment, setSelectedElement: setSelectedTreatment,
        setStatusMessage, setOpenModal });

//============================Fetches for the modals, so they can use them without having to re-render the fetches===================
    const { data: disciplines} = useFetch({ elementNamePlural:'as disciplinas', elementPath:'disciplines', setStatusMessage});
    const { data: places} = useFetch({ elementNamePlural:'as salas', elementPath:'places', setStatusMessage});

//===================================================================================================================================
    const placesById = useMemo(() => {
        const map = new Map();
        (places || []).forEach(p => {
            map.set(p.id, p.name);
        });
        return map;
    }, [places]);
//===================================================================================================================================    
    //useEffect(() => {
    //    console.log("treatments: ", treatments);
    //}, [treatments]);

    return (
        <List title="Procedimentos"
            NewElementMessage="Novo" onNewElement={() => setOpenModal("register")}
            searchPlaceholder="Pesquisar procedimento" searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        >
            {treatments.length > 0 ? (
                treatments
                    .filter((treatment) =>
                        treatment.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(treatment => (
                        <Card key={treatment.id} element={treatment} setOpenModal={setOpenModal} showSecondButton={false}
                            selectedElement={selectedTreatment} setSelectedElement={setSelectedTreatment}
                        >
                            <div className={styles.cardHeading}>
                                <span className={styles.cardIcon}>{treatment.discipline.icon}</span>
                                <div className={styles.cardDescription}>
                                    <span className={styles.cardName}>{treatment.name}</span>  
                                    <div className={styles.cardRooms}>
                                        <PlacesIcon className={styles.roomsIcon}/>
                                        <span >
                                            {treatment.rooms.map((roomId, idx) => {
                                                const name = placesById.get(Number(roomId)) ?? "Unknown";
                                                return (
                                                    <span key={roomId}>
                                                        {name}
                                                        {idx < treatment.rooms.length - 1 ? ", " : ""}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                ))
            ) : (
                <p>Nenhum tratamento encontrado</p>
            )}

            {openModal === "register" && (
                <TreatmentRegisterModal isOpen={openModal === "register"} onSuccess={handleTreatmentAdded}
                    setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)}
                    disciplines={disciplines} rooms={places}
                />
            )}
            {(openModal === "properties" && selectedTreatment) && (
                <TreatmentDetailsModal treatment={selectedTreatment} isOpen={selectedTreatment !== null}
                    setStatusMessage={setStatusMessage}
                    disciplines={disciplines} rooms={places}
                    onClose={() => {setSelectedTreatment(null); setOpenModal(null)}} onDelete={handleTreatmentDelete} onUpdate={handleTreatmentUpdate}
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