import { useEffect, useState } from "react"
import axios from "axios";
import "../styles/Perfil.css";

export default function Perfil() {
    useEffect(() => {
        listarDados()

    }, [])

    async function listarDados() {
        const response = await axios.get('http://localhost:5000/api/postos_saude')
        mudarPosto(response.data[localStorage.getItem("id_posto") - 1]);
    }

    const [posto, mudarPosto] = useState({});
    
    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <h1 className="perfil-title">Perfil do Posto</h1>
                {Object.keys(posto).length === 0 ? (
                    <div className="loading">Carregando informações...</div>
                ) : (
                    <div className="perfil-info">
                        <div className="info-item">
                            <span className="info-label">Nome do Posto</span>
                            <span className="info-value">{posto.nome_posto || "Não informado"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">CNPJ</span>
                            <span className="info-value">{posto.cnpj_posto || "Não informado"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Endereço</span>
                            <span className="info-value">{posto.endereco_posto || "Não informado"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Telefone</span>
                            <span className="info-value">{posto.telefone_posto || "Não informado"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{posto.email_posto || "Não informado"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Responsável</span>
                            <span className="info-value">{posto.responsavel_posto || "Não informado"}</span>
                        </div>
                    </div>
                )}
                <button className="back-button" onClick={() => window.history.back()}>
                    Voltar
                </button>
            </div>
        </div>
    );
}