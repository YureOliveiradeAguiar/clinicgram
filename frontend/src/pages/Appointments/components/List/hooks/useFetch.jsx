import { useState, useEffect } from "react";

import { getCookie } from "@/utils/csrf";


export default function useFetch({ elementNamePlural, elementPath, setStatusMessage }) {
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

    return { data }
}