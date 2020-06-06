import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/home';
import CreatePoints from './pages/createpoints';

const Routes = () => {
   return (
    <BrowserRouter>
        <Route component={Home} path="/" exact />
        <Route component={CreatePoints} path="/create-point" />
    </BrowserRouter>
    );
}

export default Routes;