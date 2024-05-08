const router = require('express').Router()
const { models: { City, State }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
  try {
    const states = await State.findAll( {include: [ City]}
    );
    res.json(states);
  } catch (err) {
    next(err);
  }
});

//POST: add a new Vote
router.post("/", async (req, res, next) => {
  try {
    res.status(201).send(await State.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const state = await State.findByPk(req.params.id)
    res.send(await State.update(req.body));
  } catch (error) {
    next(error);
  }
});

//Get read all votes
router.get('/:id', async (req, res, next) => {
  try {
    const vote = await State.findByPk(req.params.id,{include: [ City]}
    );
    res.json(vote);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const vote = await State.findByPk(req.params.id);
    await vote.destroy();
    res.send(vote);
  } catch (error) {
    next(error);
  }
});
