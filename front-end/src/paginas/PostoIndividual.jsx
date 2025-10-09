import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Remedio from '../props/SobraRemedio';
import FaltandoRemedio from "../props/FaltandoRemedio";

export default function PostoIndividual() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicamentos, setMedicamentos] = useState([]);
    const [posto, setPosto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [pesquisa, setPesquisa] = useState("");

    // Função para obter headers de autenticação
    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Função para verificar se o usuário é dono do posto
    function checkOwnership() {
        const currentPostoId = localStorage.getItem('id_posto');
        setIsOwner(currentPostoId === id);
    }

    // Função para carregar dados do posto
    async function carregarDadosPosto() {
        try {
            setLoading(true);
            
            // Carrega medicamentos do posto específico
            const response = await axios.get(`http://localhost:5000/api/medicamentos/posto/${id}`);
            setMedicamentos(response.data);
            
            // Se há medicamentos, pega as informações do posto do primeiro medicamento
            if (response.data.length > 0) {
                setPosto({
                    nome_posto: response.data[0].nome_posto,
                    endereco_posto: response.data[0].endereco_posto,
                    telefone_posto: response.data[0].telefone_posto
                });
            } else {
                // Se não há medicamentos, busca informações do posto diretamente
                const postoResponse = await axios.get(`http://localhost:5000/api/postos_saude/${id}`);
                if (postoResponse.data.length > 0) {
                    setPosto(postoResponse.data[0]);
                }
            }
            
            checkOwnership();
        } catch (error) {
            console.error('Erro ao carregar dados do posto:', error);
            setError('Erro ao carregar dados do posto');
        } finally {
            setLoading(false);
        }
    }

    // Função para solicitar medicamento
    async function solicitarMedicamento(idMedicamento, quantidadeDisponivel) {
        const quantidade = prompt(`Quantas unidades você deseja solicitar? (Disponível: ${quantidadeDisponivel})`);
        
        if (!quantidade || quantidade <= 0) {
            alert('Quantidade inválida');
            return;
        }

        if (parseInt(quantidade) > quantidadeDisponivel) {
            alert('Quantidade solicitada maior que a disponível');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/medicamentos/${idMedicamento}/solicitar`,
                { quantidade_solicitada: parseInt(quantidade) },
                { headers: getAuthHeaders() }
            );
            
            alert('Solicitação enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao solicitar medicamento:', error);
            alert(error.response?.data?.error || 'Erro ao solicitar medicamento');
        }
    }

    useEffect(() => {
        carregarDadosPosto();
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Carregando dados do posto...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Erro: {error}</h2>
                <button onClick={() => navigate('/')}>Voltar ao início</button>
            </div>
        );
    }

    if (!posto) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Posto não encontrado</h2>
                <button onClick={() => navigate('/')}>Voltar ao início</button>
            </div>
        );
    }

    const medicamentosFaltando = medicamentos.filter(med => med.falta && 
        med.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()));
    
    const medicamentosSobrando = medicamentos.filter(med => !med.falta && 
        med.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()));

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate('/')} style={{ 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}>
                    ← Voltar
                </button>
                
                <h1>{posto.nome_posto}</h1>
                <p><strong>Endereço:</strong> {posto.endereco_posto}</p>
                <p><strong>Telefone:</strong> {posto.telefone_posto}</p>
                
                {isOwner && (
                    <div style={{ 
                        backgroundColor: '#e7f3ff', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        margin: '10px 0',
                        border: '1px solid #007bff'
                    }}>
                        <strong>Você é o responsável por este posto</strong>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Pesquisar medicamentos..." 
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        fontSize: '16px'
                    }}
                />
            </div>

            {medicamentosFaltando.length > 0 && (
                <div>
                    <h2 style={{ color: '#dc3545' }}>Medicamentos Faltando</h2>
                    {medicamentosFaltando.map(med => (
                        <FaltandoRemedio 
                            key={med.id_medicamento}
                            id={med.id_medicamento}
                            nome={med.nome_medicamento}
                            categoria="Medicamento"
                            quantidadeFalta={med.quantidade}
                            nomePosto={med.nome_posto}
                            isOwner={isOwner}
                        />
                    ))}
                </div>
            )}

            {medicamentosSobrando.length > 0 && (
                <div>
                    <h2 style={{ color: '#28a745' }}>Medicamentos Disponíveis</h2>
                    {medicamentosSobrando.map(med => (
                        <div key={med.id_medicamento} style={{
                            border: '1px solid #28a745',
                            padding: '15px',
                            margin: '10px 0',
                            borderRadius: '5px',
                            backgroundColor: '#f8fff9'
                        }}>
                            <h3>{med.nome_medicamento}</h3>
                            <p><strong>Posto:</strong> {med.nome_posto}</p>
                            <p><strong>Quantidade Disponível:</strong> {med.quantidade}</p>
                            <p><strong>Validade:</strong> {med.data_validade}</p>
                            
                            {isOwner ? (
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Tem certeza que deseja remover este medicamento?')) {
                                            // Implementar remoção
                                        }
                                    }}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    Remover
                                </button>
                            ) : (
                                <button 
                                    onClick={() => solicitarMedicamento(med.id_medicamento, med.quantidade)}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Solicitar Medicamento
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {medicamentos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>Este posto ainda não possui medicamentos cadastrados</h3>
                </div>
            )}
        </div>
    );
}
