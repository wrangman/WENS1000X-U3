import { pool } from '../db.js';

export async function getEvent() {
   const result = await pool.query(`
    select id, name, tickets_left
    from events
    where id = 1
  `);

   return result.rows[0];
}

export async function resetEvent() {
   await pool.query(`
    update events
    set tickets_left = 1
    where id = 1
  `);
}

export async function updateEventUnsafe(event) {
   await pool.query(
      `
    update events
    set tickets_left = $1
    where id = $2
    `,
      [event.tickets_left - 1, event.id]
   );
}

export async function connectDb() {
   return pool.connect();
}
