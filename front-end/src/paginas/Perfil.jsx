import { useEffect, useState } from "react"
import axios from "axios";

export default function Perfil() {
    useEffect(() => {
        listarDados()

    }, [])

    async function listarDados() {
        const id_posto = localStorage.getItem("id_posto")
        const response = await axios.get(`http://localhost:5000/api/postos_saude/${id_posto}`)
        mudarPosto(response.data[0]);
    }

    const [posto, mudarPosto] = useState({});
    
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", gap: "0.5rem" }}>
            <h1>Nome: {posto.nome_posto}</h1>
            <h2>CNPJ {posto.cnpj_posto}</h2>
            <h2>Endereco_posto {posto.endereco_posto}</h2>
            <h2>Telefone {posto.telefone_posto}</h2>
            <h2>Email {posto.email_posto}</h2>
            <h2>Responsavel {posto.responsavel_posto}</h2>
        </div>
    );
}