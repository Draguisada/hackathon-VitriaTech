import axios from "axios";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';


export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                email_posto: email,
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
                type="email"
                placeholder="Email do posto"
                value={email}
                onChange={e => setEmail(e.target.value)}
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