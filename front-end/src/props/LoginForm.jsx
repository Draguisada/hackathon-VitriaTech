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
        
        // Validação básica do CNPJ
        if (cnpj.length < 14) {
            setError("CNPJ deve ter 14 dígitos");
            setLoading(false);
            return;
        }
        
        try {
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
            setError(err.response?.data?.error || "Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 300 }}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="CNPJ do posto (14 dígitos)"
                value={cnpj}
                onChange={e => setCnpj(e.target.value.replace(/\D/g, ''))}
                maxLength={14}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
            {error && <span style={{ color: "red" }}>{error}</span>}
        </form>
    );
}