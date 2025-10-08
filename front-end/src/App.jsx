import ListarItens from './paginas/ListarItens'
import './App.css'
import LoginForm from './props/LoginForm'
import Registrar from './paginas/Registrar';
import Perfil from './paginas/Perfil';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

function App() {

  return (
    <Router>

      <Routes>
        <Route 
        path="/login"
        element={<LoginForm />} />

        <Route path="/" element={<h2><Link to={'/login'}>Login</Link> | <Link to={'/registrar'}>Registro</Link></h2>} />

        <Route
          path="/registrar"
          element={ <Registrar /> }
        />

        <Route
          path="/dashboard"
          element={ <ListarItens /> }
        />

        <Route
          path="/perfil"
          element={ <Perfil /> }
        />

      </Routes>

    </Router>
  )
}

export default App
