import axios from "axios"

export default function FaltandoRemedio({id, nome, categoria, quantidadeFalta}) {

    async function handleDelete() {
        axios.delete(`http://localhost:5000/api/medicamentos/${id}`)
    }

    return (
        <div>
            <h1>{nome}</h1>
            <p>Faltando: {quantidadeFalta}</p>
            <p>Categoria: {categoria}</p>
            <button onClick={handleDelete}>Remover</button>
        </div>
    )
}