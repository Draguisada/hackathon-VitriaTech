import { useEffect, useState } from "react"
import axios from "axios";
import Remedio from './Remedio';

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
        axios.post('http://localhost:5000/', { nome, validade })
    }

    function handleClick() {
        adicionarRemedio('Generico', '10/10/12')
    }

    return (
        <div>
            <button onClick={handleClick}>Clique aqui para criar remedio genérico</button>
            { remedio &&
            remedio.map(user => (
            
            <Remedio key={user.id} id={user.id} nome={user.nome} validade={user.validade}/>

            ))}
        </div>
    )
}