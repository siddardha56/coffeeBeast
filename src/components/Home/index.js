import React from 'react';

import AdminPage from '../Admin';
import Menu from '../Menu';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

const HomePage = (props) => (
	<React.Fragment>
		{props.authUser.roles.includes(ROLES.ADMIN) ?
			<AdminPage {...props} />
			:
			<Menu {...props} />
		}
	</React.Fragment>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
