import { useState } from "react";
import axios from "axios";
import "./Registrar.css";

export default function Registrar() {
	const [form, setForm] = useState({
		nome_posto: "",
		cnpj_posto: "",
		endereco_posto: "",
		cidade_posto: "",
		estado_posto:"",
		telefone_posto: "",
		email_posto: "",
		senha_posto: "",
		responsavel_posto: "",
		tipo_usuario: "FARMACEUTICO"
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");
		try {
			await axios.post("http://localhost:5000/api/register", form);
			setSuccess("Cadastro realizado com sucesso!");
			window.location.href = '/login';
			setForm({
				nome_posto: "",
				cnpj_posto: "",
				endereco_posto: "",
				cidade_posto: "",
				estado_posto:"",
				telefone_posto: "",
				email_posto: "",
				senha_posto: "",
				responsavel_posto: "",
				tipo_usuario: "FARMACEUTICO"
			});
		} catch (err) {
			setError(err.response?.data?.error || "Erro ao cadastrar");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="registrar-container">
			<div className="registrar-card">
				<h1 className="registrar-title">Registrar Posto de Saúde</h1>
				<form onSubmit={handleSubmit} className="registrar-form">
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Nome do Posto</label>
							<input 
								name="nome_posto" 
								className="form-input"
								placeholder="Digite o nome do posto" 
								value={form.nome_posto} 
								onChange={handleChange} 
								required 
							/>
						</div>
						<div className="form-group">
							<label className="form-label">CNPJ</label>
							<input 
								name="cnpj_posto" 
								className="form-input"
								placeholder="Apenas números" 
								value={form.cnpj_posto} 
								onChange={handleChange} 
								maxLength={14} 
								required 
							/>
						</div>
					</div>
					
					<div className="form-group">
						<label className="form-label">Endereço</label>
						<input 
							name="endereco_posto" 
							className="form-input"
							placeholder="Digite o endereço completo" 
							value={form.endereco_posto} 
							onChange={handleChange} 
							required 
						/>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Telefone</label>
							<input 
								name="telefone_posto" 
								className="form-input"
								placeholder="(00) 00000-0000" 
								value={form.telefone_posto} 
								onChange={handleChange} 
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Email</label>
							<input 
								name="email_posto" 
								type="email" 
								className="form-input"
								placeholder="email@exemplo.com" 
								value={form.email_posto} 
								onChange={handleChange} 
								required 
							/>
						</div>
					</div>
					
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Estado</label>
							<input 
								name="telefone_posto" 
								className="form-input"
								placeholder="(00) 00000-0000" 
								value={form.telefone_posto} 
								onChange={handleChange} 
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Cidade</label>
							<input 
								name="email_posto" 
								type="email" 
								className="form-input"
								placeholder="email@exemplo.com" 
								value={form.email_posto} 
								onChange={handleChange} 
								required 
							/>
						</div>
					</div>
					
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Senha</label>
							<input 
								name="senha_posto" 
								type="password" 
								className="form-input"
								placeholder="Mínimo 6 caracteres" 
								value={form.senha_posto} 
								onChange={handleChange} 
								required 
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Responsável</label>
							<input 
								name="responsavel_posto" 
								className="form-input"
								placeholder="Nome do responsável" 
								value={form.responsavel_posto} 
								onChange={handleChange} 
								required 
							/>
						</div>
					</div>
					
					<div className="form-group">
						<label className="form-label">Tipo de Usuário</label>
						<select 
							name="tipo_usuario" 
							value={form.tipo_usuario} 
							onChange={handleChange} 
							className="form-select"
							required
						>
							<option value="FARMACEUTICO">Farmacêutico</option>
							<option value="ADMIN">Admin</option>
						</select>
					</div>
					
					<button type="submit" className="registrar-button" disabled={loading}>
						{loading ? "Registrando..." : "Registrar"}
					</button>
					
					{error && <div className="error-message">{error}</div>}
					{success && <div className="success-message">{success}</div>}
				</form>
				<div className="login-link">
					Já tem uma conta? <a href="/login">Faça login aqui</a>
				</div>
			</div>
		</div>
	);
}
