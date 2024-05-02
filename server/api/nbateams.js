const router = require('express').Router()
const { models: { NbaPlayer, NbaTeam }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
  try {
    const votes = await NbaTeam.findAll( {include: [ NbaPlayer]}
    );
    res.json(votes);
  } catch (err) {
    next(err);
  }
});

//POST: add a new Vote
router.post("/", async (req, res, next) => {
  try {
    res.status(201).send(await NbaTeam.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const vote = await NbaTeam.findByPk(req.params.id)
    res.send(await NbaTeam.update(req.body));
  } catch (error) {
    next(error);
  }
});

//Get read all votes
router.get('/:id', async (req, res, next) => {
  try {
    const vote = await NbaTeam.findByPk(req.params.id,{include: [ NbaPlayer]}
    );
    res.json(vote);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const vote = await NbaTeam.findByPk(req.params.id);
    await vote.destroy();
    res.send(vote);
  } catch (error) {
    next(error);
  }
});
