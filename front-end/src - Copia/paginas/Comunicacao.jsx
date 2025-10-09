import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Comunicacao() {
  const [posto, setPosto] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDadosPerfil();
  }, []);

  async function carregarDadosPerfil() {
    try {
      setLoading(true);
      setError(null);

      const id = localStorage.getItem('comunicacao');
      const token = localStorage.getItem('token');
      console.log(id);
      
      if (!token) {
        navigate('/login');
        return;
      }

      let postoData;
      if (id) {
        // Visualizar perfil de outro posto
        const response = await axios.get(`http://localhost:5000/api/postos_saude/${id}`);
        postoData = response.data[0];
      } else {
        // Visualizar próprio perfil
        alert('deu problema')
      }

      setPosto(postoData);

      // Carregar medicamentos do posto
      if (postoData) {
        const medicamentosResponse = await axios.get(`http://localhost:5000/api/medicamentos/${id}`);
        setMedicamentos(medicamentosResponse.data);
      }

    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      if (err.response?.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
        localStorage.removeItem('token');
        localStorage.removeItem('id_posto');
        navigate('/login');
      } else {
        setError("Erro ao carregar perfil: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Carregando perfil...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Erro: {error}</h2>
        <button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</button>
      </div>
    );
  }

  if (!posto) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Perfil não encontrado</h2>
        <button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</button>
      </div>
    );
  }

  const isOwnProfile = false;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Voltar
        </button>
        
        <h1>{posto.nome_posto}</h1>
        
        {isOwnProfile && (
          <div style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '10px', 
            borderRadius: '5px', 
            margin: '10px 0',
            border: '1px solid #007bff'
          }}>
            <strong>Seu perfil</strong>
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h2>Informações do Posto</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>CNPJ:</strong> {posto.cnpj_posto}
          </div>
          <div>
            <strong>Responsável:</strong> {posto.responsavel_posto}
          </div>
          <div>
            <strong>Endereço:</strong> {posto.endereco_posto}
          </div>
          <div>
            <strong>Telefone:</strong> {posto.telefone_posto || 'Não informado'}
          </div>
          <div>
            <strong>Email:</strong> {posto.email_posto}
          </div>
          <div>
            <strong>Tipo:</strong> {posto.tipo_usuario}
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2>Medicamentos ({medicamentos.length})</h2>
        {medicamentos.length === 0 ? (
          <p>Este posto ainda não possui medicamentos cadastrados.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Faltando */}
            <div>
              <h3 style={{ color: '#dc3545', textAlign: 'center' }}>Faltando</h3>
              {medicamentos.filter(med => med.falta).length === 0 ? (
                <p style={{ color: '#dc3545', textAlign: 'center' }}>Nenhum medicamento em falta.</p>
              ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {medicamentos.filter(med => med.falta).map(med => (
                    <div key={med.id_medicamento} style={{
                      backgroundColor: '#ffe0e0',
                      padding: '15px',
                      borderRadius: '5px',
                      border: '1px solid #ff6b6b'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0' }}>{med.nome_medicamento}</h4>
                          <p style={{ margin: '0', fontSize: '14px' }}>
                            <strong>Quantidade:</strong> {med.quantidade} |
                            <strong> Validade:</strong> {med.data_validade} |
                            <strong> Status:</strong> Em falta
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          FALTANDO
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Disponíveis */}
            <div>
              <h3 style={{ color: '#28a745', textAlign: 'center' }}>Disponíveis</h3>
              {medicamentos.filter(med => !med.falta).length === 0 ? (
                <p style={{ color: '#28a745', textAlign: 'center' }}>Nenhum medicamento disponível.</p>
              ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {medicamentos.filter(med => !med.falta).map(med => (
                    <div key={med.id_medicamento} style={{
                      backgroundColor: '#e8f5e8',
                      padding: '15px',
                      borderRadius: '5px',
                      border: '1px solid #28a745'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0' }}>{med.nome_medicamento}</h4>
                          <p style={{ margin: '0', fontSize: '14px' }}>
                            <strong>Quantidade:</strong> {med.quantidade} |
                            <strong> Validade:</strong> {med.data_validade} |
                            <strong> Status:</strong> Disponível
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          DISPONÍVEL
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}