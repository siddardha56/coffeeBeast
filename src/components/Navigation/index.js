import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <header className="header">
    <ul>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      {authUser.roles.includes(ROLES.ADMIN) ?
        <React.Fragment>
          <li>
            <Link to={ROUTES.ORDERS}>Order Management</Link>
          </li>
        </React.Fragment>
        :
        <React.Fragment>
          <li>
            <Link to={ROUTES.MY_ORDERS}>My Orders</Link>
          </li>
        </React.Fragment>
      }
    </ul>
    <h1>Welcome to CoffeeBeast</h1>
    <SignOutButton />
  </header>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
