import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CadastroSobra() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nomeMedicamento: '',
        lote: '',
        validade: '',
        quantidade: '',
        local: '',
        observacoes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const id_posto = localStorage.getItem('id_posto');
            if (!id_posto) {
                alert('Erro: Posto não identificado. Faça login novamente.');
                navigate('/login');
                return;
            }

            const dadosMedicamento = {
                id_posto: parseInt(id_posto),
                nome_medicamento: formData.nomeMedicamento,
                data_validade: formData.validade,
                falta: false, // Sobra = false
                quantidade: parseInt(formData.quantidade)
            };

            await axios.post('http://localhost:5000/api/medicamentos/', dadosMedicamento);
            
            alert('Medicamento em sobra cadastrado com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao cadastrar medicamento:', error);
            alert('Erro ao cadastrar medicamento. Tente novamente.');
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8f9fa',
            paddingTop: '80px' // Espaço para o header
        }}>
            <div style={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                padding: '20px' 
            }}>
                <div style={{
                    backgroundColor: '#D9E1F6',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    border: '1px solid #B8C8E8'
                }}>
                    <div style={{ 
                        textAlign: 'center', 
                        marginBottom: '30px' 
                    }}>
                        <h1 style={{ 
                            color: '#007bff', 
                            marginBottom: '10px',
                            fontSize: '28px',
                            fontWeight: 'bold'
                        }}>
                            Cadastrar Medicamento em Sobra
                        </h1>
                        <p style={{ 
                            color: '#6c757d', 
                            fontSize: '16px' 
                        }}>
                            Registre medicamentos que estão em excesso em seu posto
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '20px',
                            marginBottom: '20px'
                        }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    color: '#495057'
                                }}>
                                    Nome do Medicamento *
                                </label>
                                <input
                                    type="text"
                                    name="nomeMedicamento"
                                    value={formData.nomeMedicamento}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    placeholder="Ex: Paracetamol 500mg"
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    color: '#495057'
                                }}>
                                    Lote *
                                </label>
                                <input
                                    type="text"
                                    name="lote"
                                    value={formData.lote}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    placeholder="Ex: FJ2098"
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    color: '#495057'
                                }}>
                                    Data de Validade *
                                </label>
                                <input
                                    type="date"
                                    name="validade"
                                    value={formData.validade}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    color: '#495057'
                                }}>
                                    Quantidade em Sobra *
                                </label>
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={formData.quantidade}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    placeholder="Ex: 50"
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    color: '#495057'
                                }}>
                                    Local do Posto *
                                </label>
                                <input
                                    type="text"
                                    name="local"
                                    value={formData.local}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    placeholder="Ex: Unidade de Saúde Getúlio Vargas - Concórdia SC"
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    color: '#495057'
                                }}>
                                    Observações
                                </label>
                                <textarea
                                    name="observacoes"
                                    value={formData.observacoes}
                                    onChange={handleInputChange}
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Informações adicionais sobre o medicamento..."
                                />
                            </div>
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            gap: '15px', 
                            justifyContent: 'center',
                            marginTop: '30px'
                        }}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                Cadastrar Sobra
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
