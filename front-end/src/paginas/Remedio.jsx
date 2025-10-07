import axios from "axios"

export default function Remedio({id, nome, validade}) {

    async function handleDelete() {
        axios.delete(`http://localhost:5000/${id}`)
    }

    return (
        <div>
            <h1>{nome}</h1>
            <p>{validade}</p>
            <button onClick={handleDelete}>Remover</button>
        </div>
    )
}