




export default function LandingPage() {
    return (
        <div>
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-banner">
              <img
                className="hero-image"
                src="/assets/img/22222.jfif"
                alt="Banner principal"
              />
            </div>
          </section>

          {/* About Section */}
          <section className="about-section">
            <div className="about-image">
              <img
                className="about-image-img"
                src="/assets/img/aaaaa.jpg"
                alt="Imagem ilustrativa"
              />
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
    )
}