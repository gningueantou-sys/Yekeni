import React from 'react';
import './Loader.css';

function Loader() {
  return (
    <div className="loader-page">
      <div className="loader-content">
        <div className="loader-logo-wrap">
          <img src="/logo.png" alt="Yëkëni" className="loader-logo" />
          <div className="loader-ring" />
          <div className="loader-ring ring2" />
        </div>
        <h2 className="loader-titre">Yëkëni</h2>
        <p className="loader-slogan">Se retrouver, se reconnaître</p>
        <div className="loader-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

export default Loader;