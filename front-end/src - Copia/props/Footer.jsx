import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={imagesContainerStyle}>
        <img 
          src="/assets/img/ifc.png" 
          alt="Imagem 1" 
          style={imageStyle} 
        />
        <img 
          src="/assets/img/vitria.png" 
          alt="Imagem 2" 
          style={imageStyle} 
        />
        <img 
          src="/assets/img/hackathon.png" 
          alt="Imagem 3" 
          style={imageStyle} 
        />
      </div>
      <div style={emailContainerStyle}>
        <p>Entre em contato conosco pelo e-mail:</p>
        <a href="mailto:vitria.tech@gmail.com" style={emailLinkStyle}>
          vitria.tech@gmail.com
        </a>
      </div>
      <div style={copyrightContainerStyle}>
        <p style={copyrightStyle}>
          © Todos os direitos reservados Vitria Tech. Instituto Federal Catarinense Campus Concórdia
        </p>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#ADBDD2',
  color: '#fff',
  padding: '20px',
  textAlign: 'center',
};

const imagesContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginBottom: '20px',
};

const imageStyle = {
    height: '100px'
};

const emailContainerStyle = {
  marginTop: '20px',
};

const emailLinkStyle = {
  color: '#FFFFFF',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const copyrightContainerStyle = {
  marginTop: '20px',
};

const copyrightStyle = {
  fontSize: '14px',
};

export default Footer;
