// script by Krehl Kasayan

import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initializeDB.js';

const foodRestrictions = `select * from meal_restrictions`;
const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    const restrictions = await db.sequelizeDB.query(foodRestrictions, {
      type: sequelize.QueryTypes.SELECT
    });
    
    res.json(restrictions);
  } catch (err) {
    res.json({ message: 'Error has occured' });
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