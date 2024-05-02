const router = require('express').Router()
const { models: { NbaPlayer, NbaTeam }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
  try {
    const votes = await NbaPlayer.findAll( {include: [ NbaTeam]}
    );
    res.json(votes);
  } catch (err) {
    next(err);
  }
});

//POST: add a new Vote
router.post("/", async (req, res, next) => {
  try {
    res.status(201).send(await NbaPlayer.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const vote = await NbaPlayer.findByPk(req.params.id)
    res.send(await NbaPlayer.update(req.body));
  } catch (error) {
    next(error);
  }
});

//Get read all votes
router.get('/:id', async (req, res, next) => {
  try {
    const vote = await NbaPlayer.findByPk(req.params.id,{include: [NbaTeam]}
    );
    res.json(vote);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const vote = await NbaPlayer.findByPk(req.params.id);
    await vote.destroy();
    res.send(vote);
  } catch (error) {
    next(error);
  }
});
