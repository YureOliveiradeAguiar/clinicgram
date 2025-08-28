import AlertIcon from '@/assets/icons/alertSign';
import UserAddIcon from '@/assets/icons/userAddIcon';

import List from '@/components/List/List';
import StaffCard from '../StaffCard/StaffCard.jsx';
import StaffRegisterModal from '../StaffRegisterModal/StaffRegisterModal';
import StaffDetailsModal from '../StaffModal/StaffModal.jsx';

import { useEffect, useState } from 'react';

import { getCookie } from '@/utils/csrf.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function StaffList() {
    const [staffs, setStaffs] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [modalStatus, setModalStatus] = useState(null);

    const handleStaffAdded = (newStaff) => {
        setStaffs((prev) => [...prev, newStaff]);
        setIsRegisterModalOpen(false);
    };

    // Fetching for rendering staffs card in the page.
    useEffect(() => {
        fetch('/api/staffs/list/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar estagiários');
            return res.json();
        })
        .then(data => {
            setStaffs(data);
        })
        .catch(() => {
            setStatusMessage({message: "Erro de conexão com o servidor", type: "error" });
        });
    }, []);

    // Fetching for deleting a staff member.
    const handleDeleteStaff = async () => { // Viewing.
        if (!selectedStaff) return;
        if (!window.confirm('Tem certeza que deseja excluir esse estagiário?')) return;
        try {
            const res = await fetch(`/api/staffs/delete/${selectedStaff.id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                setStatusMessage({ message: "Estagiário excluído com sucesso", type: "success" });
                setStaffs(prev => // Filters out the deleted staff member.
                    prev.filter(staff => staff.id !== selectedStaff.id)
                );
                setSelectedStaff(null); // Closes the modal.
            } else {
                setStatusMessage({
                    type: "error", message: <>
                        <AlertIcon className={styles.icon} />
                        Erro ao excluir o staffe</>
                });
            }
        } catch {
            setStatusMessage({
                type: "error", message: <>
                    <AlertIcon className={styles.icon} />
                    Erro de conexão com o servidor</>
            });
        }
    };
    
    const handleUpdate = async (patchData) => {
        try {
            const res = await fetch(`/api/staffs/${patchData.id}/`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(patchData.name !== undefined && { name: patchData.name }),
                    ...(patchData.whatsapp !== undefined && { whatsapp: patchData.whatsapp }),
                }),
            });
            if (res.ok) {
                const updatedStaff = await res.json();
                setStaffs(prev =>
                    prev.map(staff => staff.id === updatedStaff.id ? updatedStaff : staff)
                );
                setSelectedStaff(updatedStaff);
                //console.log(patchData);
                setModalStatus({ message: "Atualizado com sucesso!", type: "success" });
            } else {
                setModalStatus({ message: "Erro ao atualizar", type: "error" });
            }
        } catch (err) {
            console.error("Erro ao atualizar:", err);
            setModalStatus({ message: "Erro na comunicação com o servidor", type: "error" });
        }
    };

    return (
        <List title="Estagiários"
                NewElementIcon={UserAddIcon} NewElementMessage="Novo" onNewElement={() => setIsRegisterModalOpen(true)}
                searchPlaceholder="Pesquisar estagiário" searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            {staffs.length > 0 ? (
                staffs
                    .filter((staff) =>
                        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(staff => (
                    <StaffCard key={staff.id} staff={staff}
                            modalStatus={modalStatus} setModalStatus={setModalStatus}
                            selectedStaff={selectedStaff} setSelectedStaff={setSelectedStaff} />
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhum estagiário registrado'}</p>
            )}

            {isRegisterModalOpen && (
                <StaffRegisterModal isOpen={isRegisterModalOpen} onSuccess={handleStaffAdded}
                        statusMessage={statusMessage} setStatusMessage={setStatusMessage} onClose={() => setIsRegisterModalOpen(false)} />
            )}

            {selectedStaff && (
                <StaffDetailsModal closeOnClickOutside={false} staff={selectedStaff} isOpen={selectedStaff !== null} onClose={() => setSelectedStaff(null)}
                        onDelete={handleDeleteStaff} onUpdate={handleUpdate} modalStatus={modalStatus} />
            )}

            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}