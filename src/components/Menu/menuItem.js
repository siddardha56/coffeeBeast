import React from 'react';

const MenuItem = ({ item, updateCart, order }) => (
  <tr key={item.id}>  
    <td>{item.name}</td>
    <td>{item.price} Rs</td>
    <td>
      <button type="button" data-id={item.id} disabled={!order[item.id]} onClick={updateCart(-1)}>
        -
      </button>
      <span>{order[item.id] ? order[item.id] : 0}</span>
      <button type="button" data-id={item.id} onClick={updateCart(1)}>
        +
      </button>
    </td>
  </tr>
);

export default MenuItem;
