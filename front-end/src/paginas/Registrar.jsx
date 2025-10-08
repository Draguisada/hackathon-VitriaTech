import { useState } from "react";
import axios from "axios";

export default function Registrar() {
	const [form, setForm] = useState({
		nome_posto: "",
		cnpj_posto: "",
		endereco_posto: "",
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
			setForm({
				nome_posto: "",
				cnpj_posto: "",
				endereco_posto: "",
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
		<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400, margin: "2rem auto" }}>
			<h1>Registrar Posto de Saúde</h1>
			<input name="nome_posto" placeholder="Nome do posto" value={form.nome_posto} onChange={handleChange} required />
			<input name="cnpj_posto" placeholder="CNPJ (apenas números)" value={form.cnpj_posto} onChange={handleChange} maxLength={14} required />
			<input name="endereco_posto" placeholder="Endereço" value={form.endereco_posto} onChange={handleChange} required />
			<input name="telefone_posto" placeholder="Telefone" value={form.telefone_posto} onChange={handleChange} />
			<input name="email_posto" type="email" placeholder="Email" value={form.email_posto} onChange={handleChange} required />
			<input name="senha_posto" type="password" placeholder="Senha" value={form.senha_posto} onChange={handleChange} required />
			<input name="responsavel_posto" placeholder="Responsável" value={form.responsavel_posto} onChange={handleChange} required />
			<select name="tipo_usuario" value={form.tipo_usuario} onChange={handleChange} required>
				<option value="FARMACEUTICO">Farmacêutico</option>
				<option value="ADMIN">Admin</option>
			</select>
			<button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrar"}</button>
			{error && <span style={{ color: "red" }}>{error}</span>}
			{success && <span style={{ color: "green" }}>{success}</span>}
		</form>
	);
}
