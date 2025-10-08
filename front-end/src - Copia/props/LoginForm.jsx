import axios from "axios";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';


export default function LoginForm() {
    const [cnpj, setCnpj] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        // Validação básica
        if (cnpj.length < 14) {
            setError("CNPJ deve ter 14 dígitos");
            setLoading(false);
            return;
        }
        
        if (senha.length < 3) {
            setError("Senha deve ter pelo menos 3 caracteres");
            setLoading(false);
            return;
        }
        
        try {
            // Tentar conectar com o backend
            const response = await axios.post("http://localhost:5000/api/login", {
                cnpj_posto: cnpj,
                senha_posto: senha,
            });
            // Salvar token/localStorage ou redirecionar
            localStorage.setItem("token", response.data.token);
            if (response.data.posto?.id_posto) {
                localStorage.setItem("id_posto", response.data.posto.id_posto);
            }
            alert("Login realizado com sucesso!");
            window.location.href = "/dashboard";
        } catch (err) {
            // Se o backend não estiver rodando, simular login para teste
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                console.log("Backend não está rodando, simulando login para teste...");
                localStorage.setItem("token", "test-token");
                localStorage.setItem("id_posto", "1");
                alert("Login simulado realizado com sucesso! (Backend offline)");
                window.location.href = "/dashboard";
            } else {
                setError(err.response?.data?.error || "Erro ao fazer login");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-card">
            <h1 className="login-title">Login do Posto</h1>
            <p className="login-subtitle">Acesse sua conta com CNPJ e senha</p>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label className="form-label">CNPJ do Posto</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Digite o CNPJ (apenas números)"
                        value={cnpj}
                        onChange={e => setCnpj(e.target.value.replace(/\D/g, '').slice(0, 14))}
                        maxLength={14}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
                {error && <div className="error-message">{error}</div>}
            </form>
            <div className="register-link">
                Não tem uma conta? <a href="/registrar">Registre-se aqui</a>
            </div>
        </div>
    );
}