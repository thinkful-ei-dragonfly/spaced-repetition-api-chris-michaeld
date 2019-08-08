const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();
//helps debug responses
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );
    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  // Async function
  // language = LL
  // word = _Node
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );
    const nextWord = await LanguageService.getNextWord(
      req.app.get('db'),
      language.head
    );
    res.json({
      nextWord: nextWord.original,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
      totalScore: language.total_score
    });
  } catch (error) {
    next(error);
  }
});

//added express jsonBodyParser and try catch blocks to
// debug responses better
languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  const {guess} = req.body;

  if (!guess) {
    return res.status(400).json({ error: `Missing 'guess' in request body` });
  }

  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    //make a linked list from the users lang
    const ll = LanguageService.populateLinkedList(
      req.language,
      words,
      );

    //eventually return outcome of is correct 
    res.json({
     ll,
     guess
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
