import axios from "axios"
import { Link } from "react-router-dom"

export default function SobraRemedio({id, nome, validade, quantidadeSobra, nomePosto, isOwner, onSolicitar, idPosto}) {

    // Função para obter headers de autenticação
    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async function handleDelete() {
        if (!window.confirm('Tem certeza que deseja remover este medicamento?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/medicamentos/${id}`, {
                headers: getAuthHeaders()
            });
            alert('Medicamento removido com sucesso!');
            // Recarregar a página ou atualizar a lista
            window.location.reload();
        } catch (error) {
            console.error('Erro ao remover medicamento:', error);
            alert(error.response?.data?.error || 'Erro ao remover medicamento.');
        }
    }

    async function handleSolicitar() {
        const quantidade = prompt(`Quantas unidades você deseja solicitar? (Disponível: ${quantidadeSobra})`);
        
        if (!quantidade || quantidade <= 0) {
            alert('Quantidade inválida');
            return;
        }

        if (parseInt(quantidade) > quantidadeSobra) {
            alert('Quantidade solicitada maior que a disponível');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/medicamentos/${id}/solicitar`,
                { quantidade_solicitada: parseInt(quantidade) },
                { headers: getAuthHeaders() }
            );
            
            alert('Solicitação enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao solicitar medicamento:', error);
            alert(error.response?.data?.error || 'Erro ao solicitar medicamento');
        }
    }

    return (
        <div style={{border: '1px solid #28a745', padding: '15px', margin: '10px', borderRadius: '5px', backgroundColor: '#f8fff9'}}>
            <h3>{nome}</h3>
            <p><strong>Posto:</strong> 
                {idPosto ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link to={`/posto/${idPosto}`} style={{color: '#007bff', textDecoration: 'none'}}>
                            {nomePosto || 'Não informado'}
                        </Link>
                        <Link 
                            to={`/perfil?id=${idPosto}`} 
                            style={{
                                color: '#6c757d', 
                                textDecoration: 'none', 
                                fontSize: '12px',
                                backgroundColor: '#f8f9fa',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                border: '1px solid #dee2e6'
                            }}
                            title="Ver perfil do posto"
                        >
                            👤 Perfil
                        </Link>
                    </div>
                ) : (
                    nomePosto || 'Não informado'
                )}
            </p>
            <p><strong>Expira:</strong> {validade}</p>
            <p><strong>Quantidade Disponível:</strong> {quantidadeSobra}</p>
            
            {isOwner ? (
                <button 
                    onClick={handleDelete} 
                    style={{
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '3px', 
                        cursor: 'pointer'
                    }}
                >
                    Remover
                </button>
            ) : (
                <button 
                    onClick={handleSolicitar}
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
    )
}