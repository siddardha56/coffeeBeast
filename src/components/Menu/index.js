import React from 'react';

import MenuItems from '../../constants/menuItems';
import MenuItem from './menuItem';
import * as ROUTES from '../../constants/routes';
import { ORDERED } from '../../constants/orderAttrubutes';
import { withAuthorization } from '../Session';

// const initialOrderState = () => {
// 	let order = {};
// 	MenuItems.forEach(item => {
// 		order[item.id] = {
// 			...item,
// 			quantity: 0,
// 		};
// 	});
// 	return order;
// };

class HomePage extends React.Component {
	constructor() {
		super();
		this.state = {
			total: 0,
			order: {},
		};
	}

	updateCart = (quantity) => ({ target }) => {
		const { order, total } = this.state;
		const id = Number(target.getAttribute('data-id'));
		this.setState({
			order: {
				...order,
				[id]: order[id] ? order[id] + quantity : 1,
			},
			total: total + (MenuItems[id].price * quantity),
		});
	}

	payBill = () => {
		const { order, total } = this.state;
		const { firebase, authUser, history } = this.props;
		firebase.order(authUser.uid).push({
			order: { ...order },
			total: total,
			userId: authUser.uid,
			createdAt: firebase.serverValue.TIMESTAMP,
			status: ORDERED,
		});
		history.push(ROUTES.MY_ORDERS);
	}

	render() {
		const { total, order } = this.state;
		return (
			<div style={{ display: 'flex' }}>
				<div style={{ width: '50%' }}>
					<h2>Menu</h2>
					<table style={{ width: '100%' }}>
						<thead>
							<tr>
								<th>Items</th>
								<th>Price</th>
								<th>Quantity</th>
							</tr>
						</thead>
						<tbody style={{ textAlign: 'center' }}>
							{Object.values(MenuItems).map(item => (
								<MenuItem order={order} item={item} updateCart={this.updateCart} />
							))}
							<br/>
							<tr>
								<td><b>Total</b></td>
								<td><b>{total} Rs</b></td>
								<td>
									{total ?
										<button type="button" onClick={this.payBill}>
											Pay Rs {total}
										</button> : null
									}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div style={{ width: '50%' }}>
					<h2>My Orders</h2>
				</div>
			</div>
		);
	}
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
