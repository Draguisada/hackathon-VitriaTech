import { useEffect, useState } from "react"
import axios from "axios";
import Remedio from '../props/SobraRemedio';

export default function ListarItens() {

    const tempoDeAtualizacao = 1000;
   
    const [remedio, mudarRemedios] = useState([]);

    async function listarDados() {

        const response = await axios.get('http://localhost:5000/api/medicamentos')

        mudarRemedios(response.data);

    }

    useEffect(() => {
        const interval = setInterval(() => {
            listarDados();
        }, tempoDeAtualizacao);
        return () => clearInterval(interval);

    }, []);

    async function adicionarRemedio(nome_medicamento, data_validade) {    
    await axios.post( 'http://localhost:5000/api/medicamentos/', {nome_medicamento, data_validade, id_categoria});
    }

    function handleClick() {
        if (!nomeRemedio) return alert('Sem nome dado') 
        adicionarRemedio(nomeRemedio, new Date().toLocaleDateString());
    }

    const [nomeRemedio, mudarNome] = useState('')
    const [sobrando, mudarSobrando] = useState('')
    const [id_categoria, mudarCategoria] = useState(1);
    

    return (
        <div>
            <input type="text" placeholder="Nome remedio" onChange={(e) => mudarNome(e.target.value)} />
            <input type="number" placeholder="Quantidade sobrando" onChange={(e) => mudarSobrando(e.target.value)} />
            <input type="number" placeholder="Categoria" onChange={(e) => mudarCategoria(e.target.value)} />

            <button onClick={handleClick}>Clique aqui para criar remedio sobrando</button>
            { remedio &&
            remedio.map(dados => (
            
            <Remedio key={dados.id_medicamento} categoria={dados.nome_categoria} id={dados.id_medicamento} nome={dados.nome_medicamento} validade={dados.data_validade}/>

            ))}
        </div>
    )
}