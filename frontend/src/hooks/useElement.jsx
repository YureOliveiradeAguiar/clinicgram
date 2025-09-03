import AlertIcon from "@/assets/icons/alertSign";
import { useState, useEffect } from "react";

import { getCookie } from "@/utils/csrf";


export default function useElement({ elementName, elementNamePlural, elementPath,
        selectedElement, setSelectedElement,
        setStatusMessage, setOpenModal }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`/api/${elementPath}/list/`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error(`Erro ao carregar ${elementNamePlural}`);
                return res.json();
            })
            .then(result => {
                setData(result);
            })
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, [elementPath]);

    const handleElementAdded = (newElement) => {
        setData((prev) => [...prev, newElement]);
        setOpenModal(null);
    };

    const handleElementDelete = async () => {
        if (!selectedElement) return;
        if (!window.confirm(`Tem certeza que deseja excluir ${elementName.charAt(0).toUpperCase()}${elementName.slice(1)}?`)) return;
        try {
            const res = await fetch(`/api/${elementPath}/delete/${selectedElement.id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                setStatusMessage({ message: `As informações d${elementName.charAt(0)}${elementName.slice(1)} foram excluídas com sucesso`, type: "success" });
                setData(prev => // Filters out the deleted element.
                    prev.filter(deletedElement => deletedElement.id !== selectedElement.id)
                );
                setSelectedElement(null);
                setOpenModal(null);
            } else {
                setStatusMessage({
                    type: "error", message: <>
                        <AlertIcon className="icon" />
                        Erro ao excluir {elementName}</>
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

    const buildPatch = (patchData) => {
        return Object.entries(patchData).reduce((accumulator, [key, value]) => {
            if (key !== "id" && value !== undefined) {
                accumulator[key] = value;
            }
            return accumulator;
        }, {});
    };
    const handleElementUpdate = async (patchData) => {
        const update = buildPatch(patchData);
        try {
            const res = await fetch(`/api/${elementPath}/${patchData.id}/`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(update),
            });
            if (res.ok) {
                const updatedElement = await res.json();
                setData(prev =>
                    prev.map(element => element.id === updatedElement.id ? updatedElement : element)
                );
                setSelectedElement(updatedElement);
                setStatusMessage({ message: `Informações d${elementName.charAt(0)}${elementName.slice(1)} atualizadas com sucesso!`, type: "success" });
            } else {
                setStatusMessage({ message: "Erro ao atualizar", type: "error" });
            }
        } catch (error) {
            setStatusMessage({ message: "Erro na comunicação com o servidor", type: "error" });
        }
    };

    return { data, handleElementAdded, handleElementDelete, handleElementUpdate };
}