import axios from "axios"
import "../styles/SobraRemedio.css"
import { useEffect, useState } from "react";

export default function SobraRemedio({id, nome, validade, quantidadeSobra, atualizar, id_posto}) {

    async function handleDelete() {
        if (!window.confirm('Tem certeza que deseja remover este medicamento?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/medicamentos/${id}`)
            // Recarregar a página ou atualizar a lista
            window.location.reload();
        } catch (error) {
            console.error('Erro ao remover medicamento:', error);
            alert(error.response?.data?.error || 'Erro ao remover medicamento.');
        }
    }

    async function handleSolicitar() {
        const quantidade = prompt(`Quantas unidades você deseja solicitar? (Disponível: ${quantidadeSobra})`);
        
        if (!quantidade || quantidade <= 0) {
            alert('Quantidade inválida');
            return;
        }

        if (parseInt(quantidade) > quantidadeSobra) {
            alert('Quantidade solicitada maior que a disponível');
            return;
        }

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

    const [dono, mudarDono] = useState(false);

    useEffect(() => {
        const id_posto_local = localStorage.getItem('id_posto');
        if (id_posto != id_posto_local) {
            return mudarDono(false);
            
        }
        console.log('Igual os posto_id')
        return mudarDono(true);
    }, [])

    return (
        <div className="sobra-card">
            <h3 className="sobra-name">{nome}</h3>
            <div className="sobra-quantity">
                Disponível: {quantidadeSobra} unidades
            </div>
            <div className="sobra-validity">
                Expira em: {validade}
            </div>
            {dono ?
            <button onClick={handleDelete} className="remove-button">
                Remover Medicamento
            </button>
            :
            // Se não for o dono
            <button onClick={handleSolicitar} className="request-button">
                Solicitar Requisição
            </button>
            }
        </div>
    )
}