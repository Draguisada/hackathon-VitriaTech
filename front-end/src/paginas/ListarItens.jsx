import { useEffect, useState } from "react"
import axios from "axios";
import Remedio from '../props/SobraRemedio';
import FaltandoRemedio from "../props/FaltandoRemedio";

export default function ListarItens() {

    const tempoDeAtualizacao = 1000;
    const [remedio, mudarRemedios] = useState([]);

    async function listarDados() {
        try {
            const response = await axios.get('http://localhost:5000/api/medicamentos')
            mudarRemedios(response.data);
        } catch (err) {
            // Se o backend não estiver rodando, usar dados de exemplo
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                console.log("Backend não está rodando");
            } else {
                console.error("Erro ao carregar medicamentos:", err);
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            listarDados();
        }, tempoDeAtualizacao);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        listarDados();
    }, []);

    async function adicionarRemedio(nome_medicamento, data_validade) {    
        try {
            const id_posto = localStorage.getItem('id_posto');
            const quantidade = sobrando;
            await axios.post( 'http://localhost:5000/api/medicamentos/', {id_posto, nome_medicamento, data_validade, falta: false, quantidade});

        } catch (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                console.log("Backend não está rodando, simulando adição de medicamento...");
                // Simular adição local
                const novoRemedio = {
                    id_medicamento: Date.now(),
                    nome_medicamento,
                    quantidade: parseInt(sobrando) || 0,
                    data_validade,
                    falta: false
                };
                mudarRemedios(prev => [...prev, novoRemedio]);
                alert("Medicamento adicionado (modo simulação)");
            }
        }
    }

    async function adicionarRemedioFaltando(nome_medicamento, data_validade) {    
        try {
            const quantidade = faltando;
            const id_posto = localStorage.getItem('id_posto');
            await axios.post( 'http://localhost:5000/api/medicamentos/', {id_posto, nome_medicamento, data_validade, falta: true, quantidade});

        } catch (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                console.log("Backend não está rodando");
            }
        }
    }

    function handleClick() {
        if (!nomeRemedioSobra) return alert('Sem nome dado') 
        adicionarRemedio(nomeRemedioSobra, new Date().toLocaleDateString());
    }

    function handleClickFaltando() {
        if (!nomeRemedio) return alert('Sem nome dado') 
        adicionarRemedioFaltando(nomeRemedio, new Date().toLocaleDateString());
    }

    const [nomeRemedioSobra, mudarNomeSobra] = useState('');
    const [nomeRemedio, mudarNome] = useState('');
    const [sobrando, mudarSobrando] = useState('');
    const [faltando, mudarFaltando] = useState('')
    const [pesquisa, mudarPesquisa] = useState('')
    

    return (
        <div className="listar-container">
            <div className="listar-header">
                <h1 className="listar-title">Gerenciar Medicamentos</h1>
                
                <div className="add-medicine-section">
                    <div className="medicine-form">
                        <h3 className="form-title">Adicionar Medicamento Sobrando</h3>
                        <div className="form-group">
                            <label className="form-label">Nome do Medicamento</label>
                            <input 
                                value={nomeRemedioSobra} 
                                type="text" 
                                className="form-input"
                                placeholder="Digite o nome do medicamento" 
                                onChange={(e) => mudarNomeSobra(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantidade em excesso</label>
                            <input 
                                value={sobrando} 
                                type="number" 
                                className="form-input"
                                placeholder="Quantidade disponível" 
                                onChange={(e) => mudarSobrando(e.target.value)} 
                            />
                        </div>
                        <button onClick={handleClick} className="form-button">
                            Adicionar Medicamento Sobrando
                        </button>
                    </div>

                    <div className="medicine-form">
                        <h3 className="form-title">Adicionar Medicamento Faltando</h3>
                        <div className="form-group">
                            <label className="form-label">Nome do Medicamento</label>
                            <input 
                                value={nomeRemedio} 
                                type="text" 
                                className="form-input"
                                placeholder="Digite o nome do medicamento" 
                                onChange={(e) => mudarNome(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantidade Faltando</label>
                            <input 
                                value={faltando} 
                                type="number" 
                                className="form-input"
                                placeholder="Quantidade necessária" 
                                onChange={(e) => mudarFaltando(e.target.value)} 
                            />
                        </div>
                        <button onClick={handleClickFaltando} className="form-button">
                            Adicionar Medicamento Faltando
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

            <div className="medicines-grid">
                <h2 className="section-title">Medicamentos Faltando</h2>
                {remedio &&
                remedio.filter(e => e.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()) && e.falta == true).map(dados => (
                    <FaltandoRemedio 
                        quantidadeFalta={dados.quantidade} 
                        key={dados.id_medicamento} 
                        id={dados.id_medicamento} 
                        nome={dados.nome_medicamento}
                        atualizar = {listarDados}
                        id_posto = {dados.id_posto}
                    />
                ))}
            </div>

            <div className="section-divider"></div>

            <div className="medicines-grid">
                <h2 className="section-title">Medicamentos Sobrando</h2>
                {remedio &&
                remedio.filter(e => e.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()) && e.falta == false).map(dados => (
                    <Remedio 
                        quantidadeSobra={dados.quantidade} 
                        key={dados.id_medicamento} 
                        id={dados.id_medicamento} 
                        nome={dados.nome_medicamento} 
                        validade={dados.data_validade}
                        atualizar = {listarDados}
                        id_posto = {dados.id_posto}
                    />
                ))}
            </div>
        </div>
    )
}