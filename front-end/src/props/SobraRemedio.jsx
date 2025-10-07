import axios from "axios"

export default function SobraRemedio({id, nome, validade}) {

    async function handleDelete() {
        axios.delete(`http://localhost:5000/sobra/${id}`)
    }

    return (
        <div>
            <h1>{nome}</h1>
            <p>{validade}</p>
            <button onClick={handleDelete}>Remover</button>
        </div>
    )
}