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

  if (!req.body.guess) {
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

    //store answer in a variable 
    const answer = {
      isCorrect: false
    }
    //check if guess === head.value.translation 
    //if correct
    if (req.body.guess === ll.head.value.translation) {
      //increment correct count
      ll.head.value.correct_count++;
      //memory value is *2
      ll.head.value.memory_value *= 2;
      //increment total score
      ll.total_score = ll.total_score + 1;
      //changes answer 
      answer.isCorrect = true;

    } else {
      //increment incorrect count
      ll.head.value.incorrect_count++;
      //memory value is 1 
      ll.head.value.memory_value = 1;
    }

    const memoryValue = ll.head.value.memory_value
    if (memoryValue > ll.size()) {
      memoryValue = ll.size()
    }
    const head = ll.head;
    ll.head = head.next;

    ll.insertAt(head, memoryValue)

    answer.nextWord = ll.head.value.original
    answer.wordCorrectCount = ll.head.value.correct_count
    answer.wordIncorrectCount = ll.head.value.incorrect_count
    answer.totalScore = ll.total_score
    answer.answer = head.value.translation
    console.log(answer)

    const arrays = ll.mapList()
    arrays.forEach(node => LanguageService.persistLinkedListWords(req.app.get('db'),node))
    LanguageService.persistLinkedListHead(req.app.get('db'), ll)
    

    res.json(
      answer,
    );
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
