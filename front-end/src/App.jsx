import ListarItens from './paginas/ListarItens'
import './App.css'
import LoginForm from './props/LoginForm'
import Registrar from './paginas/Registrar';
import Perfil from './paginas/Perfil';
import PostoIndividual from './paginas/PostoIndividual';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
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
          element={ 
            <ProtectedRoute>
              <div>
                <Header />
                <ListarItens />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={ 
            <ProtectedRoute>
              <div>
                <Header />
                <Perfil />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/posto/:id"
          element={ 
            <ProtectedRoute>
              <div>
                <Header />
                <PostoIndividual />
              </div>
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>
  )
}

export default App
