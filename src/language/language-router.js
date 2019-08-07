const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();

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
  // language = list
  // word = node
  const language = await LanguageService.getUsersLanguage(
    req.app.get('db'), req.user.id)
  const nextWord = await LanguageService.getNextWord(
    req.app.get('db'), language.head)
    res.json({
      nextWord: nextWord.original,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
      totalScore: language.total_score,
    })
})
  

languageRouter.post('/guess', async (req, res, next) => {
  const {answer, id} = req.body
  const language = await LanguageService.getUsersLanguage(
    req.app.get('db'), req.user.id)
  const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      language.id
    );
  
  const ll = LanguageService.populateLinkedList(words)
  const translation = await LanguageService.checkUsersGuess(
    req.app.get('db'), id
  )
  .then(word => {
    if (answer.value !== word.translation) {
    //  if answer is incorrect
    //    set memory value 
    //    increment incorrect count
    }
    //  set memory value 
    //  increment correct count
    //  increment total score
  })
  res.send('implement me!');
  res.send(200)
});

module.exports = languageRouter;
