import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ListarItens() {
    const navigate = useNavigate();
    const [pesquisa, setPesquisa] = useState('');
    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carregar medicamentos do backend
    useEffect(() => {
        carregarMedicamentos();
    }, []);

    const carregarMedicamentos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/medicamentos');
            setMedicamentos(response.data);
        } catch (error) {
            console.error('Erro ao carregar medicamentos:', error);
            setMedicamentos([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar medicamentos por tipo
    const medicamentosSobrando = medicamentos.filter(med => !med.falta);
    const medicamentosFaltando = medicamentos.filter(med => med.falta);

    const handleRegistrarSobra = () => {
        navigate('/cadastro-sobra');
    };

    const handleRegistrarFalta = () => {
        navigate('/cadastro-falta');
    };

    const handleDoarMedicamento = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/medicamentos/${id}/doar`);
            alert('Medicamento doado com sucesso!');
            carregarMedicamentos();
        } catch (error) {
            console.error('Erro ao doar medicamento:', error);
            alert('Erro ao doar medicamento');
        }
    };

    const handleSolicitarMedicamento = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/medicamentos/${id}/solicitar`);
            alert('Solicitação enviada com sucesso!');
            carregarMedicamentos();
        } catch (error) {
            console.error('Erro ao solicitar medicamento:', error);
            alert('Erro ao solicitar medicamento');
        }
    };

    const handleApagarSolicitacao = async (id) => {
        if (window.confirm('Tem certeza que deseja apagar esta solicitação?')) {
            try {
                await axios.delete(`http://localhost:5000/api/medicamentos/${id}`);
                alert('Solicitação apagada com sucesso!');
                carregarMedicamentos();
            } catch (error) {
                console.error('Erro ao apagar solicitação:', error);
                alert('Erro ao apagar solicitação');
            }
        }
    };

    const handleEditarQuantidade = async (id) => {
        const novaQuantidade = prompt('Digite a nova quantidade:');
        if (novaQuantidade && !isNaN(novaQuantidade) && novaQuantidade > 0) {
            try {
                // Buscar o medicamento atual para manter os outros campos
                const medicamentoAtual = medicamentos.find(med => med.id_medicamento == id);
                if (!medicamentoAtual) {
                    alert('Medicamento não encontrado');
                    return;
                }

                await axios.put(`http://localhost:5000/api/medicamentos/${id}`, {
                    nome_medicamento: medicamentoAtual.nome_medicamento,
                    data_validade: medicamentoAtual.data_validade,
                    falta: medicamentoAtual.falta,
                    quantidade: parseInt(novaQuantidade)
                });
                alert('Quantidade atualizada com sucesso!');
                carregarMedicamentos();
            } catch (error) {
                console.error('Erro ao editar quantidade:', error);
                alert('Erro ao editar quantidade: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    // Filtrar medicamentos por pesquisa
    const medicamentosFiltradosSobrando = medicamentosSobrando.filter(med => 
        med.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase())
    );
    const medicamentosFiltradosFaltando = medicamentosFaltando.filter(med => 
        med.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                backgroundColor: '#f8f9fa',
                paddingTop: '80px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Carregando medicamentos...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8f9fa',
            paddingTop: '80px'
        }}>
            <div style={{ 
                maxWidth: '1400px', 
                margin: '0 auto', 
                padding: '20px' 
            }}>
                {/* Botões de Ação */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            onClick={handleRegistrarSobra}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            Registrar Sobra
                        </button>
                        <button 
                            onClick={handleRegistrarFalta}
                            style={{
                                backgroundColor: 'white',
                                color: '#007bff',
                                border: '2px solid #007bff',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            Registrar Falta
                        </button>
                    </div>

                    {/* Barra de Pesquisa */}
                    <div style={{ position: 'relative' }}>
                    <input 
                        type="text" 
                        placeholder="Pesquisar medicamentos..." 
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                border: '2px solid #e9ecef',
                                borderRadius: '25px',
                                fontSize: '16px',
                                width: '300px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                    />
                </div>
            </div>

                {/* Seção: Medicamentos Sobrando */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ 
                        color: '#495057', 
                        marginBottom: '20px',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Medicamentos Sobrando ({medicamentosFiltradosSobrando.length})
                    </h2>
                    
                    {medicamentosFiltradosSobrando.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <p style={{ fontSize: '18px', color: '#6c757d' }}>
                                Nenhum medicamento em sobra encontrado
                            </p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                            gap: '20px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {medicamentosFiltradosSobrando.map(med => (
                                <div key={med.id_medicamento} style={{
                                    backgroundColor: '#D9E1F6',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    border: '1px solid #B8C8E8',
                                    transition: 'transform 0.2s'
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            backgroundColor: '#4caf50',
                                            borderRadius: '8px',
                                            margin: '0 auto 10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>
                                            {med.nome_medicamento.split(' ')[0]}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                            {med.nome_medicamento}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                                            <strong>Quantidade:</strong> {med.quantidade}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                                            <strong>Validade:</strong> {med.data_validade}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => handleEditarQuantidade(med.id_medicamento)}
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleApagarSolicitacao(med.id_medicamento)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                ))}
            </div>
                    )}
                </div>

                {/* Separador */}
                <div style={{
                    height: '2px',
                    backgroundColor: '#dee2e6',
                    margin: '40px 0',
                    borderRadius: '1px'
                }}></div>

                {/* Seção: Medicamentos Faltando */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ 
                        color: '#495057', 
                        marginBottom: '20px',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Medicamentos Faltando ({medicamentosFiltradosFaltando.length})
                    </h2>
                    
                    {medicamentosFiltradosFaltando.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <p style={{ fontSize: '18px', color: '#6c757d' }}>
                                Nenhum medicamento em falta encontrado
                            </p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                            gap: '20px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {medicamentosFiltradosFaltando.map(med => (
                                <div key={med.id_medicamento} style={{
                                    backgroundColor: '#D9E1F6',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    border: '1px solid #B8C8E8',
                                    transition: 'transform 0.2s'
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            backgroundColor: '#dc3545',
                                            borderRadius: '8px',
                                            margin: '0 auto 10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>
                                            {med.nome_medicamento.split(' ')[0]}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                            {med.nome_medicamento}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                                            <strong>Quantidade necessária:</strong> {med.quantidade}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                                            <strong>Validade:</strong> {med.data_validade}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => handleEditarQuantidade(med.id_medicamento)}
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleApagarSolicitacao(med.id_medicamento)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}