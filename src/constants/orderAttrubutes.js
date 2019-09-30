export const PLACED = 'PLACED';
export const ORDERED = 'ORDERED';
export const PREPARE = 'PREPARE';
export const COMPLETED = 'COMPLETED';

export const nextStatus = {
  [ORDERED]: PREPARE,
  [PREPARE]: COMPLETED,
};

export const orderStatus = {
  [ORDERED]: 'Ordered',
  [PREPARE]: 'Preparing',
  [COMPLETED]: 'Completed',
};