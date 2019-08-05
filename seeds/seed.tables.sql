BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  ();

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Mandarin', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'Nǐhǎo', 'Hello', 2),
  (2, 1, 'Xièxiè', 'Thank You', 3),
  (3, 1, `Bù kèqì` , `You're Wecome`, 4),
  (4, 1, 'Zǎo ', 'Good Morning', 5),
  (5, 1, `Wǎn'ān`, 'Good Night', 6),
  (6, 1, 'Wǒ jiào.', 'My name is', 7),
  (7, 1, 'Bù shì', 'No', 8),
  (8, 1, 'Shì', 'Yes', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;