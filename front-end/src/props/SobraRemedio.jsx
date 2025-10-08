import axios from "axios"

export default function SobraRemedio({id, nome, validade, categoria, quantidadeSobra}) {

    async function handleDelete() {
        axios.delete(`http://localhost:5000/api/medicamentos/${id}`)
    }

    return (
        <div>
            <h1>{nome}</h1>
            <p>Expira: {validade}</p>
            <p>Categoria: {categoria}</p>
            <p>Quantidade Sobra: {quantidadeSobra}</p>
            <button onClick={handleDelete}>Remover</button>
        </div>
    )
}