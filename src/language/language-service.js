const { LinkedList } = require('../LinkedList/linked-list');

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

  populateLinkedList(language, words) {
    const linkedList = new LinkedList({
      id: language.id,
      name: language.name,
      total_score: language.total_score
    });
    let word = words.find(w => w.id === language.head);
    linkedList.insertFirst(word);

    for (let i = 0; i < words.length; i++) {
      if (word.next) {
        word = words.find(w => w.id === word.next);
        linkedList.insertLast(word);
      }
    }
    return linkedList;
  },
  persistLinkedListWords(db, node) {
    return db.transaction(transaction =>
      db('word')
        .transacting(transaction)
        .where('id', node.id)
        .update({
          memory_value: node.memory_value,
          correct_count: node.correct_count,
          incorrect_count: node.incorrect_count,
          next: node.next ? node.next : null
        })
    );
  },
  persistLinkedListHead(db, ll) {
    return db.transaction(transaction =>
      db('language')
        .transacting(transaction)
        .where('id', ll.id)
        .update({
          total_score: ll.total_score,
          head: ll.head.value.id
        })
    );
  }
};

module.exports = LanguageService;
