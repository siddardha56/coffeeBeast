import React from 'react';

import MenuItems from '../../constants/menuItems';
import {
  orderStatus, ORDERED, PREPARE, COMPLETED,
} from '../../constants/orderAttrubutes';
import { withAuthorization } from '../Session';

class MyOrders extends React.Component {
  constructor() {
    super();
    this.state = {
      orders: {},
    };
  }

  componentDidMount() {
		const { firebase, authUser } = this.props;
   
    firebase.order(authUser.uid).on('value', snapshot => {
      const ordersObject = snapshot.val() || {};
      const orders = {
        [ORDERED]: [],
        [PREPARE]: [],
        [COMPLETED]: [],
      };
      Object.keys(ordersObject).forEach(key => {
        orders[ordersObject[key].status].push({
          ...ordersObject[key],
          uid: key,
        });
      });
      this.setState({
        orders,
      });
    });
  }

  render() {
    const { orders } = this.state;
    return (
      <div>
        <h2>My Orders</h2>
        <div style={{ display: 'flex', padding: '0 15px' }}>
          {Object.keys(orders).map(st => (
            <div key={st} style={{ width: `${100 / Object.keys(orders).length}%`, border: '1px solid' }}>
              <h3>{orderStatus[st]}</h3>
              <hr/>
              {orders[st].length > 0 ? orders[st].map(or =>
                <React.Fragment>
                  <p style={{ padding: '5px' }}>
                    <span style={{ marginRight: '20px' }}><b>Order Id:</b> {or.uid}</span>
                  </p>
                  <table style={{ width: '100%', textAlign: 'center' }}>
                    <thead>
                      <tr>
                        <th>Items</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(or.order).map(itemId => (
                        <tr style={{ padding: '5px' }}>
                          <td>{MenuItems[itemId].name}</td>
                          <td>{or.order[itemId]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <hr/>
                </React.Fragment>
              ) :
              <h4>No Orders</h4>
              }
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MyOrders);
