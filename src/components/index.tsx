import * as React from "react";
import { Link } from "react-router-dom";

function NotFound(){
    return(
        <>
        <h1>Oops! Página não encontrada</h1>
        <h2>Desculpe, a página que você está procurando não existe.</h2>
        <Link to="/">Voltar para a página inicial</Link>
        </>
    )
}

export default NotFound;