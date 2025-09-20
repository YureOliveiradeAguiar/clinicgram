import PersonAddIcon from '@/assets/icons/personAddIcon';
import styles from './ClientList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import ClientRegisterModal from '../RegisterModal/ClientRegisterModal';
import ClientStatisticsModal from '../StatisticsModal/ClientStatisticsModal';
import ClientDetailsModal from '../DetailsModal/ClientDetailsModal';

import { useState } from 'react';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import useElement from '@/hooks/useElement';


export default function ClientList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    const { data: clients,
        handleElementAdded,
        handleElementDelete,
        handleElementUpdate,
    } = useElement({ elementName: "o paciente", elementNamePlural: "os pacientes", elementPath: "clients",
        selectedElement: selectedClient, setSelectedElement: setSelectedClient,
        setStatusMessage, setOpenModal });
//================================================================================================================

    return (
        <List title="Pacientes" NewElementIcon={PersonAddIcon} NewElementMessage="Novo"
            onNewElement={() => setOpenModal("register")}
            searchPlaceholder="Pesquisar paciente" searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        >
            {clients.length > 0 ? (
                clients
                    .filter((client) =>
                        client.fullName.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(client => (
                        <Card key={client.id} element={client} setOpenModal={setOpenModal}
                                selectedElement={selectedClient} setSelectedElement={setSelectedClient}>
                            <p className={styles.cardName} aria-label={client.fullName}>
                                {client.fullName}
                            </p>
                        </Card>
                ))
            ) : (
                <p>{'Nenhum cliente encontrado'}</p>
            )}

            {openModal === "register" && (
                <ClientRegisterModal isOpen={openModal === "register"} onSuccess={handleElementAdded}
                        setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)} />
            )}
            {(openModal === "statistics" && selectedClient) && (
                <ClientStatisticsModal client={selectedClient} isOpen={selectedClient !== null} onClose={() => {setSelectedClient(null); setOpenModal(null)}}/>
            )}
            {(openModal === "properties" && selectedClient) && (
                <ClientDetailsModal client={selectedClient} isOpen={selectedClient !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedClient(null); setOpenModal(null)}} onDelete={handleElementDelete} onUpdate={handleElementUpdate}/>
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}