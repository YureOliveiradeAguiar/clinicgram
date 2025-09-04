import styles from './PlaceList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import PlaceRegisterModal from '../RegisterModal/PlaceRegisterModal';
import PlaceDetailsModal from '../DetailsModal/PlaceDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';


export default function PlaceList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const { data: places,
        handleElementAdded: handlePlaceAdded,
        handleElementDelete : handlePlaceDelete,
        handleElementUpdate : handlePlaceUpdate,
    } = useElement({ elementName: "a sala", elementNamePlural: "as salas", elementPath: "places",
        selectedElement: selectedPlace, setSelectedElement: setSelectedPlace,
        setStatusMessage, setOpenModal });


    return (
        <List title="Salas"
                NewElementMessage="Nova" onNewElement={() => setOpenModal("register")}
                searchPlaceholder="Pesquisar sala" searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            {places.length > 0 ? (
                places
                    .filter((place) =>
                        place.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(place => (
                        <Card key={place.id} element={place} setOpenModal={setOpenModal} showSecondButton={false}
                                selectedElement={selectedPlace} setSelectedElement={setSelectedPlace}>
                            
                            <p className={styles.cardName} aria-label={place.name}>
                                {place.icon}{place.name}
                            </p>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhuma sala registrada'}</p>
            )}

            {openModal === "register" && (
                <PlaceRegisterModal isOpen={openModal === "register"} onSuccess={handlePlaceAdded}
                        setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)} />
            )}
            {(openModal === "properties" && selectedPlace) && (
                <PlaceDetailsModal place={selectedPlace} isOpen={selectedPlace !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedPlace(null); setOpenModal(null)}} onDelete={handlePlaceDelete} onUpdate={handlePlaceUpdate}/>
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}