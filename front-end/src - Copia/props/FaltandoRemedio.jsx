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

    const pedirRequisicao = async () => {
        // To-do: Fazer a requisição para o backend
        try {
            const response = await axios.post(`http://localhost:5000/api/requisicoes`, {
                medicamento_id: id,
                posto_solicitante: localStorage.getItem('id_posto'),
                posto_dono: id_posto
            });
            console.log(response.data)
            alert(`Requisição enviada ao posto dono (ID: ${id_posto})`);
        } catch (error) {
            alert("Erro ao solicitar requisição. ", error);
        }
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
            <button onClick={pedirRequisicao} className="request-button">
                Doar
            </button>
            }
        </div>
    )
}