
import { pool } from '../db.js';

export async function getOrders() {
   const result = await pool.query(`
    select id, version, created_at
    from orders
    where event_id = 1
    order by id desc
  `);

   return result.rows;
}

export async function resetOrders() {
   await pool.query(`
    delete from orders
    where event_id = 1
  `);
}

export async function createOrder(eventId, version) {
   await pool.query(
      `
    insert into orders (event_id, version)
    values ($1, $2)
    `,
      [eventId, version]
   );
}

export async function createOrderWithClient(client, eventId, version) {
   await client.query(
      `
    insert into orders (event_id, version)
    values ($1, $2)
    `,
      [eventId, version]
   );
}
