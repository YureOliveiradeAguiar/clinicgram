import PersonAddIcon from '@/assets/icons/personAddIcon';
import styles from './WorkerList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import WorkerRegisterModal from '../RegisterModal/WorkerRegisterModal';
import WorkerStatisticsModal from '../StatisticsModal/WorkerStatisticsModal';
import WorkerDetailsModal from '../DetailsModal/WorkerDetailsModal';

import { useState } from 'react';

import useElement from '@/hooks/useElement.jsx';
import useFetch from '@/hooks/useFetch.jsx';

import { useAutoClearStatus } from '@/utils/useAutoClearStatus';


export default function WorkerList() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);

    const { data: workers,
        handleElementAdded,
        handleElementDelete,
        handleElementUpdate,
    } = useElement({ elementName: "o estagiário", elementNamePlural: "os estagiários", elementPath: "workers",
        selectedElement: selectedWorker, setSelectedElement: setSelectedWorker,
        setStatusMessage, setOpenModal });

    const { data: appointments} = useFetch({ elementNamePlural:'as consultas', elementPath:'appointments', setStatusMessage});
//==================================================================================================================================

    return (
        <List title="Estagiários"
                NewElementIcon={PersonAddIcon} NewElementMessage="Novo" onNewElement={() => setOpenModal("register")}
                searchPlaceholder="Pesquisar estagiário" searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            {workers.length > 0 ? (
                workers
                    .filter((worker) =>
                        worker.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(worker => (
                        <Card key={worker.id} element={worker} setOpenModal={setOpenModal}
                                selectedElement={selectedWorker} setSelectedElement={setSelectedWorker}>
                            <p className={styles.cardName} aria-label={worker.name}>
                                {worker.name}
                            </p>
                        </Card>
                ))
            ) : (
                <p>Nenhum estagiário encontrado</p>
            )}

            {openModal === "register" && (
                <WorkerRegisterModal isOpen={openModal === "register"} onSuccess={handleElementAdded}
                    setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)}
                />
            )}
            {(openModal === "statistics" && selectedWorker) && (
                <WorkerStatisticsModal worker={selectedWorker} appointments={appointments}
                    isOpen={selectedWorker !== null} onClose={() => {setSelectedWorker(null); setOpenModal(null)}}
                />
            )}
            {(openModal === "properties" && selectedWorker) && (
                <WorkerDetailsModal worker={selectedWorker} isOpen={selectedWorker !== null} setStatusMessage={setStatusMessage}
                    onClose={() => {setSelectedWorker(null); setOpenModal(null)}} onDelete={handleElementDelete} onUpdate={handleElementUpdate}
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