import React from 'react';

import {
  orderStatus, nextStatus, ORDERED, PREPARE, COMPLETED,
} from '../../constants/orderAttrubutes';
import { withAuthorization } from '../Session';
import MenuItems from '../../constants/menuItems';

class OrderManagement extends React.Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      ordersObject: {},
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    firebase.orders().on('value', snapshot => {
      const ordersObject = snapshot.val() || {};
      const orders = {
        [ORDERED]: [],
        [PREPARE]: [],
        [COMPLETED]: [],
      };
      Object.keys(ordersObject).forEach(userId => {
        Object.keys(ordersObject[userId]).forEach(orderId => {
          orders[ordersObject[userId][orderId].status].push({
            ...ordersObject[userId][orderId],
            orderId,
          });
        });
      });
      this.setState({
        orders,
        ordersObject,
      })
    });
  }

  updateStatus = ({ target }) => {
    let currentOrder = {};
    const { orders, ordersObject } = this.state;
    const { firebase } = this.props;

    const userId = target.getAttribute('data-userid');
    const orderId = target.getAttribute('data-orderid');
    const status = target.getAttribute('data-status');

    orders[status].forEach(order => {
      if (order.orderId === orderId) {
        currentOrder = order;
      }
    });

    firebase.order(userId).set({
      ...ordersObject[userId],
      [orderId]: {
      ...currentOrder,
      status: nextStatus[status],
    }})
  }

  render() {
    const { orders } = this.state;
    return (
      <div>
        <h2>Orders</h2>
        <div style={{ display: 'flex', padding: '0 15px' }}>
          {Object.keys(orders).map(st => (
            <div key={st} style={{ width: `${100 / Object.keys(orders).length}%`, border: '1px solid' }}>
              <h3>{orderStatus[st]}</h3>
              <hr/>
              {orders[st].length > 0 ? orders[st].map(or =>
                <React.Fragment key={or.orderId}>
                  <div style={{ padding: '5px' }}>
                    <p><b>Order Id:</b> {or.orderId}</p>
                    <p><b>User Id:</b> {or.userId}</p>
                  </div>
                  <table style={{ width: '100%', textAlign: 'center' }}>
                    <thead>
                      <tr>
                        <th>Items</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(or.order).map(itemId => (
                        <tr key={itemId} style={{ padding: '5px' }}>
                          <td>{MenuItems[itemId].name}</td>
                          <td>{or.order[itemId]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {st !== COMPLETED &&
                    <button
                      data-status={st}
                      data-userid={or.userId}
                      data-orderid={or.orderId}
                      onClick={this.updateStatus}
                    >
                      Order {nextStatus[st]}
                    </button>
                  }
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

export default withAuthorization(condition)(OrderManagement);
