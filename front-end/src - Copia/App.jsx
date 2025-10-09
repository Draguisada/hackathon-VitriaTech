import ListarItens from './paginas/ListarItens'
import './styles/App.css'
import LoginForm from './paginas/Login'
import Registrar from './paginas/Registrar';
import Perfil from './paginas/Perfil';
// import Perfil from '../src/paginas/Perfil';
import LandingPage from './paginas/LandingPage';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

function App() {

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id_posto");
    window.location.href = "/";
  }

  const PrecisaToken = ({ children }) => {
      const token = localStorage.getItem('token');

      // PARA DEBUG ==============================================
      return children;

      // Se não houver token, redireciona o usuário para a página de login
      if (!token) {
      return <Navigate to="/login" replace />;
      }
      // Se houver token, permite que o componente filho (Dashboard) seja renderizado
      return children;
  };

    const MostrarSeToken = ({ children }) => {
      const token = localStorage.getItem('token');
      
      // PARA DEBUG ==============================================
      return children;

      // Se não houver token, redireciona o usuário para a página de login
      if (!token) {
      return;
      }
      // Se houver token, permite que o componente filho (Dashboard) seja renderizado
      return children;
  };

  const MostrarNaoSeToken = ({ children }) => {
      const token = localStorage.getItem('token');

      // PARA DEBUG ==============================================
      return children;

      // Se não houver token, redireciona o usuário para a página de login
      if (token) {
      return;
      }
      // Se houver token, permite que o componente filho (Dashboard) seja renderizado
      return children;
  };

  return (
    <Router>
      <div className="app">
        {/* Header */}
        <header className="header">
          <Link to="/" className="brand">Vitria Tech</Link>
          <nav className="nav">
            <ul className="nav-links">
              <MostrarNaoSeToken>
                <li><Link to="/" className="nav-link">Principal</Link></li>
              </MostrarNaoSeToken>
              <li><Link to="/dashboard" className="nav-link">Visualizar Medicamentos</Link></li>
              <MostrarSeToken>
                <li><Link to="/perfil" className="nav-link">Perfil</Link></li>
              </MostrarSeToken>
            </ul>
            <MostrarNaoSeToken>
              <Link to="/login" className="login-btn">Login</Link>
            </MostrarNaoSeToken>

            <MostrarNaoSeToken>
                <Link to="/registrar" className="login-btn">Registrar-se</Link>
              </MostrarNaoSeToken>
            <MostrarSeToken>
              <Link to="/" className="login-btn" onClick={handleLogout}>Sair</Link>
            </MostrarSeToken>
          </nav>
        </header>

        <Routes>
          <Route 
            path="/login"
            element={<LoginForm />} 
          />

          <Route 
            path="/" 
            element={<LandingPage/>} 
          />

          <Route
            path="/registrar"
            element={ <Registrar /> }
          />
        
            <Route
              path="/dashboard"
              element={ <PrecisaToken>
                          <ListarItens/>
                        </PrecisaToken> }
            />

            <Route
              path="/perfil"
              element={ <PrecisaToken>
                          <Perfil/>
                        </PrecisaToken> }
            />

        </Routes>
      </div>
    </Router>
  )
}

export default App
