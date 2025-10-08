import ListarItens from './paginas/ListarItens'
import './styles/App.css'
import Login from './paginas/Login'
import Registrar from './paginas/Registrar';
import Perfil from './paginas/Perfil';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="app">
        {/* Header */}
        <header className="header">
          <Link to="/" className="brand">Vitria Tech</Link>
          <nav className="nav">
            <ul className="nav-links">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/dashboard" className="nav-link">medicamentos</Link></li>
            </ul>
            <Link to="/login" className="login-btn">Login</Link>
          </nav>
        </header>

        <Routes>
          <Route 
            path="/login"
            element={<Login />} 
          />

          <Route 
            path="/" 
            element={
              <div>
                {/* Hero Section */}
                <section className="hero-section">
                  <div className="hero-banner">
                    Banner Principal
                  </div>
                </section>

                {/* About Section */}
                <section className="about-section">
                  <div className="about-image">
                    🏔️
                  </div>
                  <div className="about-content">
                    <h2>O que é a Vitria Tech</h2>
                    <p>
                      Nosso site conecta postos de saúde para facilitar a troca de informações sobre sobras e faltas de medicamentos, 
                      promovendo o uso eficiente dos estoques e garantindo que mais pacientes recebam o tratamento necessário.
                    </p>
                  </div>
                </section>
              </div>
            } 
          />

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
      </div>
    </Router>
  )
}

export default App
