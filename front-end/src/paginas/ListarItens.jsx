import { useEffect, useState } from "react"
import axios from "axios";
import Remedio from '../props/SobraRemedio';
import FaltandoRemedio from "../props/FaltandoRemedio";

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
        await axios.post( 'http://localhost:5000/api/medicamentos/', {nome_medicamento, data_validade, id_categoria, falta: false, quantidade: sobrando});
    }

    async function adicionarRemedioFaltando(nome_medicamento) {    
        const quantidade = faltando;
        await axios.post( 'http://localhost:5000/api/medicamentos/', {nome_medicamento, data_validade: '01/01/1970', id_categoria, falta: true, quantidade});
    }

    function handleClick() {
        if (!nomeRemedioSobra) return alert('Sem nome dado') 
        adicionarRemedio(nomeRemedioSobra, vencimento);
    }

    function handleClickFaltando() {
        if (!nomeRemedio) return alert('Sem nome dado') 
        adicionarRemedioFaltando(nomeRemedio);
    }

    const [nomeRemedioSobra, mudarNomeSobra] = useState('');
    const [nomeRemedio, mudarNome] = useState('');
    const [sobrando, mudarSobrando] = useState('');
    const [faltando, mudarFaltando] = useState('')
    const [id_categoria, mudarCategoria] = useState(1);
    const [pesquisa, mudarPesquisa] = useState('');
    const [vencimento, mudarVencimento] = useState('');


    return (
        <div>
            <input value={nomeRemedioSobra} type="text" placeholder="Nome remedio" onChange={(e) => mudarNomeSobra(e.target.value)} />
            <input value={sobrando} type="number" placeholder="Quantidade sobrando" onChange={(e) => mudarSobrando(e.target.value)} />
            <input value={id_categoria} type="number" placeholder="Categoria" onChange={(e) => mudarCategoria(e.target.value)} />
            <button  onClick={handleClick}>Clique aqui para criar remedio sobrando</button>
            <br/>
            <hr/>
            <input value={nomeRemedio}type="text" placeholder="Nome remedio" onChange={(e) => mudarNome(e.target.value)} />
            <input  value={faltando}  type="number" placeholder="Quantidade faltando" onChange={(e) => mudarFaltando(e.target.value)} />
            <input  value={id_categoria} type="number" placeholder="Categoria" onChange={(e) => mudarCategoria(e.target.value)} />
            <button onClick={handleClickFaltando}>Clique aqui para criar remedio faltando</button>
            <br/>
            <input type="date" onChange={(e) => mudarVencimento(e.target.value.replaceAll('-', '/'))} />
            <hr/>
            <input type="text" name="Pesquisa" placeholder="pesquisa" onChange={(e) => mudarPesquisa(e.target.value)} />
            <br />


            { remedio &&
            remedio.filter(e => e.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()) && e.falta == true).map(dados => (
            
            <FaltandoRemedio quantidadeFalta={dados.quantidade} key={dados.id_medicamento} categoria={dados.nome_categoria} id={dados.id_medicamento} nome={dados.nome_medicamento}/>

            ))}
            <hr/>
            { remedio &&
            remedio.filter(e => e.nome_medicamento.toLowerCase().includes(pesquisa.toLowerCase()) && e.falta == false).map(dados => (
            
            <Remedio quantidadeSobra={dados.quantidade} key={dados.id_medicamento} categoria={dados.nome_categoria} id={dados.id_medicamento} nome={dados.nome_medicamento} validade={dados.data_validade}/>

            ))}
        </div>
    )
}