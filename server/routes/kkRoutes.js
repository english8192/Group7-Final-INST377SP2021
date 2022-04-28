// script by Krehl Kasayan

import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initializeDB.js';

const foodRestrictions = `select * from meal_restrictions`;
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const restrictions = await db.sequelizeDB.query(foodRestrictions, {
        type: sequelize.QueryTypes.SELECT
      });

      res.json(restrictions);
    } catch (err) {
      res.json({ message: 'Error has occured' });
    }
  })
router.post('/post', async (req, res) => {
  // TODO original: Error: Table
  // 'Dining_Hall_Tracker.Meals_Locations' doesn't exist

  // const postQuery = `INSERT INTO meal_restrictions VALUES('${req.query['new_meal_id']}')`;

  const postQuery = `INSERT INTO dietary_restrictions(restriction_id) VALUE ('${req.query['new_rest_id']}');`;
  const postQuerySecond = `INSERT INTO dietary_restrictions VALUES ('${req.query['new_meal_id']}');`;

  try {
    const result = await db.sequelizeDB.query(postQuery, {
      type: sequelize.QueryTypes.POST
    });
    res.json(`Posted a new row entry with new value:  ${req.query['new_rest_id']}`);

    const resultSecond = await db.sequelizeDB.query(postQuerySecond, {
      type: sequelize.QueryTypes.POST
    });
    res.json(`Posted a new row entry with new value:  ${req.query['new_meal_id']}`);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
router.delete('/delete', async (req, res) => {
  const deleteQuery =
    `DELETE FROM dietary_restrictions WHERE restriction_id = ${req.query['restriction_id']} ;`;
  try {
    const result = await db.sequelizeDB.query(deleteQuery, {
      type: sequelize.QueryTypes.DELETE
    });

    res.json(`Deleted the new row entry with meal id:  ${req.query['restriction_id']}`);
  } catch (e) {
    console.log(`The following error has occured ${e}`);
    res.send(`Result could not be furfilled because of ${e}`);
  }
});
router.put('/update', async (req, res) => {
  const updateQuery =

    `   
      UPDATE dietary_restrictions
      SET restriction_type = '${req.query['new_restriction_type']}'
      WHERE restriction_id = '${req.query['restriction_id']}'
      `;
  try {
    const result = await db.sequelizeDB.query(updateQuery, {

      type: sequelize.QueryTypes.UPDATE
    });

    res.json(`Updated the row entry ${req.query['restriction_id']} with new value: ${req.query['restriction_id']}`);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

// gets all the meal id's that have a specific restriction ID
router.route('/:restriction_id').get(async (req, res) => {
  const restrictionQuery = `SELECT * FROM meal_restrictions WHERE restriction_id =${req.params.restriction_id}`;
  try {
    const restrictions = await db.sequelizeDB.query(restrictionQuery, {
      type: sequelize.QueryTypes.SELECT
    });
    res.json(restrictions);
  } catch (err) {
    res.json({ message: 'Error has occured' });
  }
});
export default router;