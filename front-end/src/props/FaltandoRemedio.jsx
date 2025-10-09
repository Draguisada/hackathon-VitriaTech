import axios from "axios"
import { Link } from "react-router-dom"

export default function FaltandoRemedio({id, nome, categoria, quantidadeFalta, nomePosto, isOwner, idPosto}) {

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

    return (
        <div style={{border: '1px solid #ff6b6b', padding: '15px', margin: '10px', borderRadius: '5px', backgroundColor: '#ffe0e0'}}>
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
            <p><strong>Faltando:</strong> {quantidadeFalta}</p>
            <p><strong>Categoria:</strong> {categoria}</p>
            
            {isOwner && (
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
            )}
        </div>
    )
}