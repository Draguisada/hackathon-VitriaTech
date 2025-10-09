import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={logosWrapperStyle}>
        <div style={logoItemStyle}>
          <img 
            src="/assets/img/ifc.png" 
            alt="Logo IFC" 
            style={ifcImageStyle} 
          />
        </div>
        <div style={centralLogoStyle}>
          <img 
            src="/assets/img/vitria.png" 
            alt="Logo Vitria" 
            style={vitriaImageStyle} 
          />
        </div>
        <div style={logoItemStyle}>
          <img 
            src="/assets/img/hackathon.png" 
            alt="Logo Hackathon" 
            style={hackathonImageStyle} 
          />
        </div>
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


const logosWrapperStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '30px', 
  marginBottom: '20px',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const logoItemStyle = {
  flex: '1 1 100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};


const centralLogoStyle = {
  flex: '1 1 200px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};


const ifcImageStyle = {
  height: '60px',
  maxWidth: '100%',
};

const vitriaImageStyle = {
  height: '100px',
  maxWidth: '100%',
};

const hackathonImageStyle = {
  height: '80px',
  maxWidth: '100%',
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
