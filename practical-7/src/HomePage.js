import React from 'react';
import homeImg from './gatee.jpg';
import logoImg from './uni.png';

function HomePage() {
  const sectionStyle = {
    backgroundImage: `url(${homeImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  const logoStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px', // Change to left for top-left
    width: '120px',
    height: 'auto',
    zIndex: 10
  };

  const boxStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.4)',
    color: 'white',
    textAlign: 'center',
    maxWidth: '80%',
  };

  return (
    <div style={sectionStyle}>
      <img src={logoImg} alt="Charusat Logo" style={logoStyle} />
      <div style={boxStyle}>
        <h2>Welcome to my Charusat!</h2>
        <p>Charotar University of Science and Technology (CHARUSAT) is a private university located in Changa, Anand, Gujarat, India. It was established by the Gujarat Act No. 8 of 1995, Government of Gujarat and is recognized by the University Grants Commission (UGC) under Section 22 of the UGC Act 1956. </p>
      </div>
    </div>
  );
}

export default HomePage;


// import React from 'react';
// import homeImg from './gatee.jpg';
// import logoImg from './uni.png';
// import './homepage.css'; // Link to the CSS

// function HomePage() {
//   return (
//     <div className="homepage-section" style={{ backgroundImage: `url(${homeImg})` }}>
//       <img src={logoImg} alt="Charusat Logo" className="homepage-logo" />
//       <div className="homepage-box">
//         <h2>Welcome to my Charusat!</h2>
//         <p>
//           Charotar University of Science and Technology (CHARUSAT) is a private university located in Changa, Anand, Gujarat, India.
//           It was established by the Gujarat Act No. 8 of 1995, Government of Gujarat and is recognized by the University Grants
//           Commission (UGC) under Section 22 of the UGC Act 1956.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default HomePage;
