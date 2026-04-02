import { getEvent, resetEvent, updateEventUnsafe, connectDb } from '../models/eventModel.js';
import { getOrders, resetOrders, createOrder, createOrderWithClient } from '../models/orderModel.js';

function sleep(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getState(req, res) {
   const event = await getEvent();
   const orders = await getOrders();

   res.json({
      event,
      orders,
   });
}

export async function resetState(req, res) {
   await resetOrders();
   await resetEvent();

   res.json({
      message: 'Systemet är återställt.',
   });
}

export async function buyUnsafe(req, res) {
   const event = await getEvent();

   if (event.tickets_left <= 0) {
      return res.status(409).json({
         message: 'Slutsålt.',
      });
   }

   await sleep(1000);

   await updateEventUnsafe(event);
   await createOrder(event.id, 'unsafe');

   res.json({
      message: 'Köp lyckades i osäker version.',
   });
}

export async function buySafe(req, res) {
   const client = await connectDb();

   try {
      await client.query('begin');

      const updateResult = await client.query(`
      update events
      set tickets_left = tickets_left - 1
      where id = 1
        and tickets_left > 0
      returning tickets_left
    `);

      if (updateResult.rowCount === 0) {
         await client.query('rollback');
         return res.status(409).json({
            message: 'Slutsålt.',
         });
      }

      await sleep(1000);

      await createOrderWithClient(client, 1, 'safe');

      await client.query('commit');

      res.json({
         message: 'Köp lyckades i säker version.',
      });

   } catch (error) {
      await client.query('rollback');
      res.status(500).json({
         message: 'Något gick fel.',
      });
      
   } finally {
      client.release();
   }
}