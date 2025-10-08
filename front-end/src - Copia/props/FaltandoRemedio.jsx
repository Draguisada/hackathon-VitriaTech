import axios from "axios"
import "../styles/FaltandoRemedio.css"

export default function FaltandoRemedio({id, nome, categoria, quantidadeFalta}) {

    async function handleDelete() {
        axios.delete(`http://localhost:5000/api/medicamentos/${id}`)
    }

    return (
        <div className="faltando-card">
            <h3 className="faltando-name">{nome}</h3>
            <div className="faltando-category">{categoria}</div>
            <div className="faltando-quantity">
                Faltando: {quantidadeFalta} unidades
            </div>
            <button onClick={handleDelete} className="remove-button">
                Remover Medicamento
            </button>
        </div>
    )
}