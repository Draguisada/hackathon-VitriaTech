import { useEffect, useState } from "react"
import axios from "axios";
import { Link } from "react-router-dom";
import Remedio from '../props/SobraRemedio';
import FaltandoRemedio from "../props/FaltandoRemedio";
import "../styles/ListarItens.css";

export default function ListarItens() {
    const tempoDeAtualizacao = 5000;
   
    const [remedio, mudarRemedios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPostoId, setCurrentPostoId] = useState(null);

    async function listarDados() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token de autenticação não encontrado');
                return;
            }
            
            const response = await axios.get('http://localhost:5000/api/medicamentos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Medicamentos carregados:', response.data.length);
        mudarRemedios(response.data);
            setError(""); // Limpa erro se sucesso
        } catch (err) {
            console.error("Erro ao carregar medicamentos:", err);
            if (err.response?.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                localStorage.removeItem('token');
                localStorage.removeItem('id_posto');
            } else {
                setError("Erro ao carregar medicamentos: " + (err.response?.data?.error || err.message));
            }
        }
    }

    useEffect(() => {
        // Verifica se o usuário está logado
        const token = localStorage.getItem('token');
        const postoId = localStorage.getItem('id_posto');
        
        if (!token || !postoId) {
            setError('Você precisa estar logado para acessar esta página');
            return;
        }
        
        setCurrentPostoId(postoId);
        listarDados();
        const interval = setInterval(() => {
            listarDados();
        }, tempoDeAtualizacao);
        return () => clearInterval(interval);
    }, []);

    async function adicionarRemedio(nome_medicamento, data_validade) {    
        const id_posto = localStorage.getItem('id_posto');
        await axios.post( 'http://localhost:5000/api/medicamentos/', {id_posto, nome_medicamento, data_validade, id_categoria, falta: false, quantidade: sobrando});
    }

    async function adicionarRemedioFaltando(nome_medicamento) {    
        const quantidade = faltando;
        const id_posto = localStorage.getItem('id_posto');
        await axios.post( 'http://localhost:5000/api/medicamentos/', {id_posto, nome_medicamento, data_validade: '01/01/1970', id_categoria, falta: true, quantidade});
    }

    function handleClick() {
        if (!nomeRemedioSobra) return alert('Nome é obrigatório');
        if (!dataValidadeSobra) return alert('Data de validade é obrigatória');
        if (!sobrando || sobrando <= 0) return alert('Quantidade deve ser maior que zero');
        adicionarRemedio(nomeRemedioSobra, dataValidadeSobra, sobrando);
    }

    function handleClickFaltando() {
        if (!nomeRemedio) return alert('Nome é obrigatório');
        if (!dataValidadeFalta) return alert('Data de validade é obrigatória');
        if (!faltando || faltando <= 0) return alert('Quantidade deve ser maior que zero');
        adicionarRemedioFaltando(nomeRemedio, dataValidadeFalta, faltando);
    }

    const [nomeRemedioSobra, mudarNomeSobra] = useState('');
    const [nomeRemedio, mudarNome] = useState('');
    const [sobrando, mudarSobrando] = useState('');
    const [faltando, mudarFaltando] = useState('');
    const [dataValidadeSobra, mudarDataValidadeSobra] = useState('');
    const [dataValidadeFalta, mudarDataValidadeFalta] = useState('');
    const [pesquisa, mudarPesquisa] = useState('');
    
    const currentPostoId = parseInt(localStorage.getItem('id_posto'));

    return (
        <div className="listar-container">
            <div className="listar-header">
                <h1 className="listar-title">Gerenciar Medicamentos</h1>
                
                <div className="add-medicine-section">
                    <div className="medicine-form">
                        <h3 className="form-title">Adicionar Medicamento Sobrando</h3>
                        <div className="form-group">
                            <label className="form-label">Nome do Medicamento *</label>
                            <input 
                                value={nomeRemedioSobra} 
                                type="text" 
                                className="form-input"
                                placeholder="Digite o nome do medicamento" 
                                onChange={(e) => mudarNomeSobra(e.target.value)} 
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Data de Validade *</label>
                            <input 
                                value={dataValidadeSobra} 
                                type="date" 
                                className="form-input"
                                onChange={(e) => mudarDataValidadeSobra(e.target.value)} 
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantidade Disponível *</label>
                            <input 
                                value={sobrando} 
                                type="number" 
                                className="form-input"
                                placeholder="Quantidade disponível" 
                                onChange={(e) => mudarSobrando(e.target.value)} 
                                disabled={loading}
                                min="0"
                            />
                        </div>
                        <button 
                            onClick={handleClick} 
                            className="form-button"
                            disabled={loading}
                        >
                            {loading ? 'Adicionando...' : 'Adicionar Medicamento Sobrando'}
                        </button>
                    </div>

                    <div className="medicine-form">
                        <h3 className="form-title">Adicionar Medicamento Faltando</h3>
                        <div className="form-group">
                            <label className="form-label">Nome do Medicamento *</label>
                            <input 
                                value={nomeRemedio} 
                                type="text" 
                                className="form-input"
                                placeholder="Digite o nome do medicamento" 
                                onChange={(e) => mudarNome(e.target.value)} 
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Data de Validade *</label>
                            <input 
                                value={dataValidadeFalta} 
                                type="date" 
                                className="form-input"
                                onChange={(e) => mudarDataValidadeFalta(e.target.value)} 
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantidade Necessária *</label>
                            <input 
                                value={faltando} 
                                type="number" 
                                className="form-input"
                                placeholder="Quantidade necessária" 
                                onChange={(e) => mudarFaltando(e.target.value)} 
                                disabled={loading}
                                min="1"
                            />
                        </div>
                        <button 
                            onClick={handleClickFaltando} 
                            className="form-button"
                            disabled={loading}
                        >
                            {loading ? 'Adicionando...' : 'Adicionar Medicamento Faltando'}
                        </button>
                    </div>
                </div>

                <div className="search-section">
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Pesquisar medicamentos..." 
                        onChange={(e) => mudarPesquisa(e.target.value)} 
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="medicines-grid">
                <h2 className="section-title">Medicamentos Faltando</h2>
                {remedio.length === 0 ? (
                    <p className="no-results">Nenhum medicamento encontrado</p>
                ) : (
                    remedio
                        .filter(e => e.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()) && e.falta === true)
                        .map(dados => (
                            <FaltandoRemedio 
                                quantidadeFalta={dados.quantidade} 
                                key={dados.id_medicamento} 
                                id={dados.id_medicamento} 
                                nome={dados.nome_medicamento}
                                nomePosto={dados.nome_posto}
                                idPosto={dados.id_posto}
                                isOwner={dados.id_posto === currentPostoId}
                            />
                        ))
                )}
            </div>

            <div className="section-divider"></div>

            <div className="medicines-grid">
                <h2 className="section-title">Medicamentos Sobrando</h2>
                {remedio.length === 0 ? (
                    <p className="no-results">Nenhum medicamento encontrado</p>
                ) : (
                    remedio
                        .filter(e => e.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()) && e.falta === false)
                        .map(dados => (
                            <Remedio 
                                quantidadeSobra={dados.quantidade} 
                                key={dados.id_medicamento} 
                                id={dados.id_medicamento} 
                                nome={dados.nome_medicamento} 
                                validade={dados.data_validade}
                                nomePosto={dados.nome_posto}
                                idPosto={dados.id_posto}
                                isOwner={dados.id_posto === currentPostoId}
                            />
                        ))
                )}
            </div>
        </div>
    )
}