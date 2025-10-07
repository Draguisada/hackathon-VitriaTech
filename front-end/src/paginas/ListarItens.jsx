import { useEffect, useState } from "react"
import axios from "axios";
import Remedio from '../props/SobraRemedio';

export default function ListarItens() {

    const tempoDeAtualizacao = 1000;
   
    const [remedio, mudarRemedios] = useState([]);

    async function listarDados() {

        const response = await axios.get('http://localhost:5000/')

        let valores = Object.values(response.data);
        valores = valores.map(e => JSON.parse(e))

        mudarRemedios(valores);
        // console.log(valores)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            listarDados();
        }, tempoDeAtualizacao);
        return () => clearInterval(interval);

    }, []);

    async function adicionarRemedio(nome, validade) {
        axios.post('http://localhost:5000/sobrando/', { nome, validade, sobrando })
    }

    function handleClick() {
        if (!nomeRemedio) return alert('Sem nome dado') 
        adicionarRemedio(nomeRemedio, new Date().toLocaleString())
    }

    const [nomeRemedio, mudarNome] = useState('')
    const [sobrando, mudarSobrando] = useState('')
    

    return (
        <div>
            <input type="text" placeholder="Nome remedio" onChange={(e) => mudarNome(e.target.value)} />
            <input type="number" placeholder="Quantidade sobrando" onChange={(e) => mudarSobrando(e.target.value)} />

            <button onClick={handleClick}>Clique aqui para criar remedio sobrando</button>
            { remedio &&
            remedio.map(user => (
            
            <Remedio key={user.id} id={user.id} nome={user.nome} validade={user.validade}/>

            ))}
        </div>
    )
}