import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
    const [posto, setPosto] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        carregarDadosPosto();
    }, []);

    async function carregarDadosPosto() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setPosto(response.data);
        } catch (error) {
            console.error('Erro ao carregar dados do posto:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('id_posto');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('id_posto');
        navigate('/login');
    }

    if (loading) {
        return (
            <header style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2>Carregando...</h2>
            </header>
        );
    }

    if (!posto) {
        return null;
    }

    return (
        <header style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h2 style={{ margin: 0 }}>Sistema de Medicamentos</h2>
                <nav style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid white',
                            padding: '5px 15px',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => navigate('/perfil')}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid white',
                            padding: '5px 15px',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        Perfil
                    </button>
                </nav>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {posto.nome_posto}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        CNPJ: {posto.cnpj_posto}
                    </div>
                </div>
                
                <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}>
                    {posto.nome_posto.charAt(0)}
                </div>
                
                <button 
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    title="Sair do sistema"
                >
                    Sair
                </button>
            </div>
        </header>
    );
}
