import { useEffect, useState } from "react"
import axios from "axios";
import Remedio from '../props/SobraRemedio';
import FaltandoRemedio from "../props/FaltandoRemedio";
import "../styles/ListarItens.css";

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
                console.log("Backend não está rodando, usando dados de exemplo...");
                mudarRemedios([
                    {
                        id_medicamento: 1,
                        nome_medicamento: "Paracetamol 500mg",
                        nome_categoria: "Analgésico",
                        quantidade: 50,
                        data_validade: "2024-12-31",
                        falta: false
                    },
                    {
                        id_medicamento: 2,
                        nome_medicamento: "Ibuprofeno 400mg",
                        nome_categoria: "Anti-inflamatório",
                        quantidade: 30,
                        data_validade: "2024-11-15",
                        falta: false
                    },
                    {
                        id_medicamento: 3,
                        nome_medicamento: "Dipirona 500mg",
                        nome_categoria: "Analgésico",
                        quantidade: 0,
                        data_validade: "2024-10-20",
                        falta: true
                    }
                ]);
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

    async function adicionarRemedio(nome_medicamento, data_validade) {    
        try {
            await axios.post( 'http://localhost:5000/api/medicamentos/', {nome_medicamento, data_validade, id_categoria, falta: false, quantidade: 0});
        } catch (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                console.log("Backend não está rodando, simulando adição de medicamento...");
                // Simular adição local
                const novoRemedio = {
                    id_medicamento: Date.now(),
                    nome_medicamento,
                    nome_categoria: "Categoria " + id_categoria,
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
            await axios.post( 'http://localhost:5000/api/medicamentos/', {nome_medicamento, data_validade, id_categoria, falta: true, quantidade});
        } catch (err) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                console.log("Backend não está rodando, simulando adição de medicamento faltando...");
                // Simular adição local
                const novoRemedio = {
                    id_medicamento: Date.now(),
                    nome_medicamento,
                    nome_categoria: "Categoria " + id_categoria,
                    quantidade: parseInt(faltando) || 0,
                    data_validade,
                    falta: true
                };
                mudarRemedios(prev => [...prev, novoRemedio]);
                alert("Medicamento faltando adicionado (modo simulação)");
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
    const [id_categoria, mudarCategoria] = useState(1);
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
                            <label className="form-label">Quantidade Sobrando</label>
                            <input 
                                value={sobrando} 
                                type="number" 
                                className="form-input"
                                placeholder="Quantidade disponível" 
                                onChange={(e) => mudarSobrando(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoria</label>
                            <input 
                                value={id_categoria} 
                                type="number" 
                                className="form-input"
                                placeholder="ID da categoria" 
                                onChange={(e) => mudarCategoria(e.target.value)} 
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
                        <div className="form-group">
                            <label className="form-label">Categoria</label>
                            <input 
                                value={id_categoria} 
                                type="number" 
                                className="form-input"
                                placeholder="ID da categoria" 
                                onChange={(e) => mudarCategoria(e.target.value)} 
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
                remedio.filter(e => e.nome_medicamento.includes(pesquisa) && e.falta == true).map(dados => (
                    <FaltandoRemedio 
                        quantidadeFalta={dados.quantidade} 
                        key={dados.id_medicamento} 
                        categoria={dados.nome_categoria} 
                        id={dados.id_medicamento} 
                        nome={dados.nome_medicamento}
                    />
                ))}
            </div>

            <div className="section-divider"></div>

            <div className="medicines-grid">
                <h2 className="section-title">Medicamentos Sobrando</h2>
                {remedio &&
                remedio.filter(e => e.nome_medicamento.toLowerCase().includes(pesquisa) && e.falta == false).map(dados => (
                    <Remedio 
                        quantidadeSobra={dados.quantidade} 
                        key={dados.id_medicamento} 
                        categoria={dados.nome_categoria} 
                        id={dados.id_medicamento} 
                        nome={dados.nome_medicamento} 
                        validade={dados.data_validade}
                    />
                ))}
            </div>
        </div>
    )
}