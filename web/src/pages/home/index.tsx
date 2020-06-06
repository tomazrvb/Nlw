import React from 'react';
import logo from '../../assets/logo.svg'
import './style.css'
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom'

const Home = () =>{
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" />
                </header>
                <main>
                    <h1>Seu Marketplace de Coleta de Residuos</h1>
                    <p> Ajudamos pessoas as encontrarem pontos de cleta de forma eficiente</p>
                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong> Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;