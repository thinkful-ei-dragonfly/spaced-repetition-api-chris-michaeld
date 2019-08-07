const LinkedList = require('../LinkedList/linked-list')

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  // get next word has to take in (db, id) (NOT db, language)
  // since you call this method on a word. Words are like _Nodes
  // WORDS = array of word {objects}; like _Nodes
  // LANGUAGE = list of words
  getNextWord(db, id) {
    return db
      .from('word')
      .select('*')
      .where({ id })
      .first();
  },

  checkUsersGuess(db, id) {
    return db 
      .from('word')
      .select('translation', 'original', 'id')
      .where('word.id', id)
  },

  populateLinkedList(words) {
    const linkedList = new LinkedList()

    words.forEach(word => linkedList.insertLast(word))
    return linkedList
  },
  incrementWord() {
    const word = ll.find(id)
    word.correct_count +=1
    return
  },
  decrementWord(ll, id) {
    const word = ll.find(id)
    word.incorrect_count +=1
    return
  },
  updateMemoryValue() {

  },
  persistLinkedListInDatabase() {

  },
};

module.exports = LanguageService;
