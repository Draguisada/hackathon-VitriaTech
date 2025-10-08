import axios from "axios"
import "../styles/SobraRemedio.css"

export default function SobraRemedio({id, nome, validade, categoria, quantidadeSobra}) {

    async function handleDelete() {
        axios.delete(`http://localhost:5000/api/medicamentos/${id}`)
    }

    return (
        <div className="sobra-card">
            <h3 className="sobra-name">{nome}</h3>
            <div className="sobra-category">{categoria}</div>
            <div className="sobra-quantity">
                Disponível: {quantidadeSobra} unidades
            </div>
            <div className="sobra-validity">
                Expira em: {validade}
            </div>
            <button onClick={handleDelete} className="remove-button">
                Remover Medicamento
            </button>
        </div>
    )
}