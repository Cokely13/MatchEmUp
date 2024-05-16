const router = require('express').Router()
const { models: { City, State }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
  try {
    const votes = await City.findAll( {include: [ State]}
    );
    res.json(votes);
  } catch (err) {
    next(err);
  }
});

//POST: add a new Vote
router.post("/", async (req, res, next) => {
  try {
    res.status(201).send(await City.create(req.body));
  } catch (error) {
    next(error);
  }
});

// router.put('/:id', async (req, res, next) => {
//   try {
//     const vote = await City.findByPk(req.params.id)
//     res.send(await City.update(req.body));
//   } catch (error) {
//     next(error);
//   }
// });

router.put('/:id', async (req, res, next) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (city) {
      await city.update(req.body);
      res.send(city);
    } else {
      res.status(404).send('City not found');
    }
  } catch (error) {
    next(error);
  }
});

//Get read all votes
router.get('/:id', async (req, res, next) => {
  try {
    const vote = await City.findByPk(req.params.id,{include: [State]}
    );
    res.json(vote);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const vote = await City.findByPk(req.params.id);
    await vote.destroy();
    res.send(vote);
  } catch (error) {
    next(error);
  }
});
