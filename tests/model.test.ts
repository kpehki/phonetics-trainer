import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSteps, difficulties, filterStories, modes, sentenceText, stories } from '../model.ts';

test('each sentence runs syllables, words, sentence in canonical order', () => {
  const story = stories[0];
  const steps = createSteps(story, [...modes].reverse());
  let offset = 0;
  story.sentences.forEach((words, sentence) => {
    const expected = [...words.flatMap((parts, word) => parts.map((_, syllable) => ({ sentence, mode: 'syllables' as const, word, syllable }))), ...words.map((_, word) => ({ sentence, mode: 'words' as const, word, syllable: 0 })), { sentence, mode: 'sentence' as const, word: 0, syllable: 0 }];
    assert.deepEqual(steps.slice(offset, offset + expected.length), expected);
    offset += expected.length;
  });
  assert.equal(steps.length, offset);
});

test('syllable steps visit every syllable in order before the next word', () => {
  const story = stories[0];
  const steps = createSteps(story, ['syllables']);
  assert.deepEqual(steps.slice(0, 5).map(step => [step.word, step.syllable]), [[0, 0], [0, 1], [1, 0], [2, 0], [2, 1]]);
  assert.equal(steps.length, story.sentences[0].flat().length + story.sentences.slice(1).reduce((sum, sentence) => sum + sentence.flat().length, 0));
});

test('every nonempty selection includes only selected modes and all sentences', () => {
  for (let mask = 1; mask < 8; mask++) {
    const selected = modes.filter((_, i) => mask & (1 << i));
    for (const story of stories) {
      const steps = createSteps(story, selected);
      assert.ok(steps.every(step => selected.includes(step.mode)));
      assert.deepEqual([...new Set(steps.map(step => step.sentence))], story.sentences.map((_, i) => i));
      assert.equal(steps.at(-1)?.mode, selected.at(-1));
    }
  }
  assert.deepEqual(createSteps(stories[0], []), []);
});

test('curated stories reconstruct punctuation and have vowel-based syllables', () => {
  for (const story of stories) {
    assert.ok(story.sentences.length >= 3 && story.sentences.length <= 5);
    for (const sentence of story.sentences) {
      assert.match(sentenceText(sentence), /[.!?]$/);
      for (const word of sentence) {
        if (word.length > 1) for (const syllable of word) assert.equal((syllable.match(/[аеёиоуыэюя]/gi) ?? []).length, 1, syllable);
      }
    }
  }
});

test('difficulty filter groups every story and selects only the requested level', () => {
  for (const level of difficulties) {
    const filtered = filterStories(level);
    assert.ok(filtered.length >= 3, `${level} needs at least three stories`);
    assert.deepEqual(filtered, stories.filter(story => story.difficulty === level));
    assert.ok(filtered.every(story => story.difficulty === level));
  }
  assert.deepEqual(filterStories('all'), stories);
  assert.equal(difficulties.reduce((count, level) => count + filterStories(level).length, 0), stories.length);
});

test('expanded library has unique stories and preserves an easy default', () => {
  assert.ok(stories.length >= 9);
  assert.equal(new Set(stories.map(story => story.id)).size, stories.length);
  assert.equal(new Set(stories.map(story => story.title)).size, stories.length);
  assert.equal(stories[0].difficulty, 'easy');
  assert.equal(filterStories('easy')[0], stories[0]);
});
