import { useEffect, useRef, useState } from 'react';
import { createSteps, difficulties, difficultyLabels, filterStories, modes, sentenceText, stories, type Difficulty, type Mode } from './model';

const labels: Record<Mode, string> = { syllables: 'По слогам', words: 'По словам', sentence: 'Предложениями' };
const hints: Record<Mode, string> = { syllables: 'Собираем слово из кусочков', words: 'Читаем слово целиком', sentence: 'Соединяем слова в историю' };
type Phase = 'config' | 'guided' | 'reread' | 'results';

export default function App() {
  const [storyId, setStoryId] = useState(stories[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('easy');
  const [selection, setSelected] = useState<Mode[]>([...modes]);
  const selected = modes.filter(mode => selection.includes(mode));
  const [phase, setPhase] = useState<Phase>('config');
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [replays, setReplays] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const story = stories.find(item => item.id === storyId)!;
  const steps = createSteps(story, selected);
  const step = steps[index];
  const sentence = story.sentences[step?.sentence ?? 0];
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!canSpeak) return;
    const update = () => setVoices(window.speechSynthesis.getVoices());
    update();
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => { window.speechSynthesis.removeEventListener('voiceschanged', update); window.speechSynthesis.cancel(); };
  }, [canSpeak]);

  useEffect(() => {
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [phase, index, canSpeak]);

  useEffect(() => { heading.current?.focus(); }, [phase]);

  function advance() {
    if (phase === 'reread') setPhase('results');
    else if (phase === 'guided' && index < steps.length - 1) setIndex(value => value + 1);
    else if (phase === 'guided') setPhase('reread');
  }

  useEffect(() => {
    if (phase !== 'guided' && phase !== 'reread') return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.code !== 'Space' || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
       if (target instanceof Element && target.closest('button.speech-control')) {
         event.preventDefault();
         if (!event.repeat) advance();
         return;
       }
       if (target instanceof Element && target.closest('input, button, select, textarea, a, [contenteditable="true"], [role="button"]')) return;
      event.preventDefault();
      if (!event.repeat) advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function speak() {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    const text = phase === 'reread' ? story.sentences.map(sentenceText).join(' ') : step.mode === 'sentence' ? sentenceText(sentence) : sentence[step.word].join('');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.voice = voices.find(voice => voice.lang.toLowerCase() === 'ru-ru') ?? voices.find(voice => voice.lang.toLowerCase().startsWith('ru')) ?? null;
    utterance.rate = 0.8;
    utterance.onend = utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    setReplays(value => value + 1);
    window.speechSynthesis.speak(utterance);
  }

  function start() {
    if (!selected.length) { setError('Выбери хотя бы один способ чтения.'); return; }
    setIndex(0); setReplays(0); setError(''); setPhase('guided');
  }

  const active = phase === 'guided' || phase === 'reread';
  return <div className="app-shell">
    <header className="header"><a className="brand" href="./" aria-label="Листик, главная"><span className="brand-mark">л</span>листик<span className="brand-dot">.</span></a><span className="header-note">РАСТЁМ ЧИТАТЕЛЯМИ</span><span className="age-tag">6+ лет</span></header>
    <main>
      {phase === 'config' && <>
        <div className="intro"><span className="eyebrow">МАЛЕНЬКИЕ ШАГИ · БОЛЬШИЕ ИСТОРИИ</span><h1 ref={heading} tabIndex={-1}>У каждого слова<br />есть <span className="serif">своя история.</span></h1><p>По слогам, по словам, а потом целиком.<br />Читаем в своём темпе, без спешки и таймера.</p><div className="sun" aria-hidden="true">✳</div></div>
        <section className="config-section" aria-labelledby="story-title"><div className="section-heading"><h2 id="story-title"><span className="number">01</span> Выбери историю</h2><span>Короткая история, большое открытие</span></div>
          <div className="difficulty-filter" role="group" aria-label="Сложность">
            <span>Сложность</span>
            <div className="difficulty-buttons">{([...difficulties, 'all'] as const).map(level => <button type="button" key={level} className="difficulty-button" aria-pressed={difficulty === level} onClick={() => {
              setDifficulty(level);
              const available = filterStories(level);
              if (!available.some(item => item.id === storyId)) setStoryId(available[0].id);
            }}>{level === 'all' ? 'Все уровни' : difficultyLabels[level]} <span className="difficulty-count" aria-label="историй">{filterStories(level).length}</span></button>)}</div>
          </div>
           {difficulties.filter(level => difficulty === 'all' || difficulty === level).map(level => <div className="difficulty-group" key={level}><h3>{difficultyLabels[level]}</h3><div className="story-grid">{filterStories(level).map((item, i) => <label key={item.id} className={`story-card story-${i} ${storyId === item.id ? 'chosen' : ''}`}><input type="radio" name="story" value={item.id} aria-label={`${item.title}, ${difficultyLabels[item.difficulty]}`} checked={storyId === item.id} onChange={() => setStoryId(item.id)} /><span className="story-art" role="img" aria-label={`Иллюстрация: ${item.title}`}><span aria-hidden="true">{item.illustration}</span></span><span className="story-name">{item.title}</span><span className="story-level">{difficultyLabels[item.difficulty]}{storyId === item.id && ' · Выбрано'}</span><span className="story-caption">{item.caption}</span><span className="story-meta">{item.sentences.length} предложения <span aria-hidden="true">↗</span></span>{storyId === item.id && <button type="button" className="card-start" onClick={event => { event.preventDefault(); event.stopPropagation(); start(); }}>Начать <span aria-hidden="true">→</span></button>}</label>)}</div></div>)}
        </section>
        <section className="config-section" aria-labelledby="mode-title"><div className="section-heading"><h2 id="mode-title"><span className="number">02</span> Как будем читать?</h2><span>Можно выбрать несколько способов</span></div><div className="mode-grid">{modes.map((mode, i) => <label className={`mode-card ${selected.includes(mode) ? 'checked' : ''}`} key={mode}><input type="checkbox" checked={selected.includes(mode)} onChange={event => { setSelected(value => event.target.checked ? [...value, mode] : value.filter(item => item !== mode)); setError(''); }} /><span><b>{labels[mode]}</b><small>{hints[mode]}</small></span><span className="mode-sample" aria-hidden="true">{['ма·ки', 'маки', 'А вот и маки.'][i]}</span></label>)}</div><p className="error" role="alert">{error}</p></section>
        <div className="start-bar"><p><span aria-hidden="true">☀</span> Всё получится. Начнём с одного слова.</p><button className="primary" onClick={start}>Начать читать <span aria-hidden="true">→</span></button></div>
      </>}

      {active && <>
        <div className="session-top"><button className="text-button" onClick={() => setPhase('config')}>← К настройкам</button><span>{story.title}</span><span className="pill">{phase === 'reread' ? 'Самостоятельное чтение' : `Предложение ${(step?.sentence ?? 0) + 1} из ${story.sentences.length}`}</span></div>
        <div className="progress-track" role="progressbar" aria-label="Прогресс чтения" aria-valuemin={0} aria-valuemax={steps.length + 1} aria-valuenow={phase === 'reread' ? steps.length : index}><div style={{ width: `${100 * (phase === 'reread' ? steps.length : index) / (steps.length + 1)}%` }} /></div>
        <div className="reading-heading"><span className="eyebrow">{phase === 'reread' ? 'ЕЩЁ ОДНО МАЛЕНЬКОЕ ОТКРЫТИЕ' : `ШАГ ${selected.indexOf(step.mode) + 1} ИЗ ${selected.length}`}</span><h1 ref={heading} tabIndex={-1}>{phase === 'reread' ? 'А теперь вся история' : labels[step.mode]}</h1><p>{phase === 'reread' ? 'Прочитай сам, от начала до конца. Здесь уже нет подсказок.' : hints[step.mode] + '. Нажми «Дальше», когда будешь готов.'}</p></div>
        <section className={`reading-card ${phase === 'reread' ? 'reread' : ''}`} aria-label="Текст для чтения">
          {phase === 'reread' ? <><span className="book-label">{story.title}</span><div className="full-text">{story.sentences.map((words, i) => <p key={i}>{sentenceText(words)}</p>)}</div><span className="card-footnote">Без подсказок. В твоём темпе.</span></> : <>
            <div className="mode-steps">{modes.filter(mode => selected.includes(mode)).map(mode => <span key={mode} className={step.mode === mode ? 'current' : ''} aria-current={step.mode === mode ? 'step' : undefined}>{labels[mode]}</span>)}</div>
            {step.mode === 'sentence' ? <div className="sentence-context">{story.sentences.map((words, i) => <p key={i} className={i === step.sentence ? 'active-sentence' : ''} aria-current={i === step.sentence ? 'true' : undefined}>{sentenceText(words)}</p>)}</div> : <><p className="word-context">{sentence.map((word, i) => <span key={i} className={i === step.word ? 'active-word' : ''} aria-current={i === step.word ? 'true' : undefined}>{word.join('')}{' '}</span>)}</p><div className={`focus-word ${step.mode}`} aria-label={sentence[step.word].join('')}>{step.mode === 'syllables' ? sentence[step.word].map((part, i) => <span key={i} className={i === step.syllable ? 'active-syllable' : ''} aria-current={i === step.syllable ? 'true' : undefined}>{part}</span>) : sentence[step.word].join('')}</div><span className="card-footnote" aria-live="polite">Слово {step.word + 1} из {sentence.length}{step.mode === 'syllables' && ` · Слог ${step.syllable + 1} из ${sentence[step.word].length}`}</span></>}
          </>}
        </section>
         <div className="reading-controls"><button className="secondary speech-control" onClick={speak} disabled={!canSpeak} aria-label={speaking ? 'Остановить озвучивание' : 'Послушать текст'}>{speaking ? '■ Остановить' : '♪ Послушать'}</button><span className="keyboard-hint">Можно нажать <kbd>пробел</kbd></span><button className="primary" onClick={advance}>{phase === 'reread' ? 'Я прочитал!' : index === steps.length - 1 ? 'Читать целиком' : 'Дальше'} <span aria-hidden="true">→</span></button></div>
        {!canSpeak && <p className="support-note">В этом браузере озвучивание недоступно. Можно читать самостоятельно.</p>}
      </>}

      {phase === 'results' && <section className="results"><div className="result-flower" aria-hidden="true">✿</div><span className="eyebrow">ЕЩЁ ОДНА ИСТОРИЯ В ТВОЕЙ КОПИЛКЕ</span><h1 ref={heading} tabIndex={-1}>Вот это <span className="serif">получилось!</span></h1><p>Ты прочитал историю «{story.title}».<br />С подсказками, а потом совсем самостоятельно.</p><div className="result-stats"><div><b>{story.sentences.length}</b><span>предложения</span></div><div><b>{selected.length}</b><span>способа чтения</span></div><div><b>{replays}</b><span>прослушиваний</span></div></div><button className="primary" onClick={start}>Прочитать ещё раз ↻</button><button className="text-button" onClick={() => setPhase('config')}>Выбрать другую историю →</button></section>}
    </main>
    <footer><span>листик · маленькая практика каждый день</span><span>Не быстрее. Увереннее.</span></footer>
  </div>;
}
