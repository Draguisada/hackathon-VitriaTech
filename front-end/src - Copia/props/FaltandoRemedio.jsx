import axios from "axios"
import "../styles/FaltandoRemedio.css"
import { useEffect, useState } from "react";

export default function FaltandoRemedio({id, nome, quantidadeFalta, atualizar, id_posto}) {
    async function handleDelete() {
        axios.delete(`http://localhost:5000/api/medicamentos/${id}`);
        atualizar();
    }

    const [dono, mudarDono] = useState(false);

    useEffect(() => {
        const id_posto_local = localStorage.getItem('id_posto');
        if (id_posto != id_posto_local) {
            return mudarDono(false);
            
        }
        console.log('Igual os posto_id')
        return mudarDono(true);
    }, [])


    async function handleSolicitar() {

        localStorage.setItem('comunicacao', id_posto);
        window.location.href = '/comunicacao';

        // try {
        //     const response = await axios.post(
        //         `http://localhost:5000/api/medicamentos/${id}/solicitar`,
        //         { quantidade_solicitada: parseInt(quantidade) }
        //     );
            
        //     alert('Solicitação enviada com sucesso!');
        // } catch (error) {
        //     console.error('Erro ao solicitar medicamento:', error);
        //     alert(error.response?.data?.error || 'Erro ao solicitar medicamento');
        // }
    }

    return (
        <div className="faltando-card">
            <h3 className="faltando-name">{nome}</h3>
            <div className="faltando-quantity">
                Faltando: {quantidadeFalta} unidades
            </div>
            {dono ?
            <button onClick={handleDelete} className="remove-button">
                Remover Medicamento
            </button> :

            // Se não for o dono
            <button onClick={handleSolicitar} className="request-button">
                Doar
            </button>
            }
        </div>
    )
}