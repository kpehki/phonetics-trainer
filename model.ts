export const modes = ['syllables', 'words', 'sentence'] as const;
export type Mode = typeof modes[number];
export const difficulties = ['easy', 'steady', 'hard'] as const;
export type Difficulty = typeof difficulties[number];
export const difficultyLabels: Record<Difficulty, string> = { easy: 'Легко', steady: 'Уверенно', hard: 'Сложно' };
export type Story = { id: string; difficulty: Difficulty; title: string; caption: string; icon: string; sentences: string[][][] };

// Hyphens are editorial syllable boundaries, never inferred at runtime.
function sentence(value: string): string[][] {
  return value.split(' ').map(word => word.split('-'));
}

export const stories: Story[] = [
  { id: 'flowers', difficulty: 'easy', title: 'Маки у дома', caption: 'Простые слова из 2–3 слогов', icon: '✿', sentences: [
    sentence('Ма-ма и Ми-ла по-ли-ли ма-ки.'),
    sentence('У до-ма вы-рос-ли пи-о-ны.'),
    sentence('Ма-ма да-ла Ми-ле ро-зу.'),
    sentence('Ми-ла ра-да по-дар-ку.'),
  ] },
  { id: 'kitten', difficulty: 'easy', title: 'Котёнок дома', caption: 'Про сон и мягкие лапы', icon: '♧', sentences: [
    sentence('У Ни-ны жи-вёт ко-тё-нок.'),
    sentence('О-на да-ла е-му во-ды.'),
    sentence('Ко-тё-нок лёг на ко-вёр.'),
    sentence('Ни-на ти-хо се-ла ря-дом.'),
  ] },
  { id: 'berries', difficulty: 'easy', title: 'Ягоды для папы', caption: 'Маленький летний подарок', icon: '✿', sentences: [
    sentence('Ле-на со-бра-ла ма-ли-ну.'),
    sentence('О-на по-ло-жи-ла я-го-ды в мис-ку.'),
    sentence('Па-па при-шёл до-мой.'),
    sentence('Ле-на да-ла е-му ма-ли-ну.'),
  ] },
  { id: 'puddle', difficulty: 'easy', title: 'После дождя', caption: 'Лужа, солнце и игра', icon: '≈', sentences: [
    sentence('У до-ма бы-ла лу-жа.'),
    sentence('Ди-ма на-дел са-по-ги.'),
    sentence('Он ша-гал по во-де.'),
    sentence('А по-том вы-шло сол-нце.'),
  ] },
  { id: 'garden', difficulty: 'steady', title: 'Маленький сад', caption: 'Про заботу и первые ростки', icon: '✿', sentences: [
    sentence('У Ма-ши был ма-лень-кий сад.'),
    sentence('О-на по-са-ди-ла там ма-ки.'),
    sentence('Каж-дый день Ма-ша по-ли-ва-ла цве-ты.'),
    sentence('Ско-ро сад стал яр-ким и кра-си-вым.'),
  ] },
  { id: 'cat', difficulty: 'steady', title: 'Кот и кораблик', caption: 'Одно маленькое приключение', icon: '≈', sentences: [
    sentence('У ко-та был бу-маж-ный ко-раб-лик.'),
    sentence('Кот пус-тил е-го по ру-чью.'),
    sentence('Ко-раб-лик плыл, а кот бе-жал ря-дом.'),
    sentence('У мос-та ко-та ждал друг.'),
  ] },
  { id: 'forest', difficulty: 'steady', title: 'Прогулка в лесу', caption: 'Прислушаемся к природе', icon: '♧', sentences: [
    sentence('Ут-ром Ми-ша по-шёл в лес.'),
    sentence('На вет-ке си-де-ла бел-ка.'),
    sentence('О-на дер-жа-ла в лап-ках шиш-ку.'),
    sentence('Ми-ша ти-хо по-ма-хал ей ру-кой.'),
  ] },
  { id: 'feeder', difficulty: 'steady', title: 'Птичья столовая', caption: 'Поможем птицам зимой', icon: '♧', sentences: [
    sentence('Зи-мой Са-ша сде-лал кор-муш-ку.'),
    sentence('Он на-сы-пал ту-да се-ме-чек.'),
    sentence('Ско-ро при-ле-те-ли две си-ни-цы.'),
    sentence('Са-ша смот-рел на птиц из ок-на.'),
  ] },
  { id: 'observatory', difficulty: 'hard', title: 'Звёздная экспедиция', caption: 'Длинные слова и сложные сочетания', icon: '✳', sentences: [
    sentence('Пу-те-шест-вен-ни-ки при-бли-зи-лись к об-сер-ва-то-ри-и.'),
    sentence('Ис-сле-до-ва-тель на-стро-ил не-о-бык-но-вен-ный те-ле-скоп.'),
    sentence('На не-бо-сво-де по-ка-за-лось у-ди-ви-тель-но-е со-звез-ди-е.'),
    sentence('Впе-чат-ле-ни-я от на-блю-де-ни-я за-пом-ни-лись на-дол-го.'),
  ] },
  { id: 'bridge', difficulty: 'hard', title: 'Мост для муравья', caption: 'Изобретение на лесной тропинке', icon: '≈', sentences: [
    sentence('По-сле до-ждя на тро-пин-ке по-я-ви-лась лу-жа.'),
    sentence('Ма-лень-кий му-ра-вей ос-та-но-вил-ся пе-ред во-дой.'),
    sentence('Ва-ря по-ло-жи-ла че-рез лу-жу де-ре-вян-ну-ю па-лоч-ку.'),
    sentence('Му-ра-вей пе-ре-брал-ся по мос-ти-ку на дру-гой бе-рег.'),
  ] },
  { id: 'shadows', difficulty: 'hard', title: 'Театр на стене', caption: 'Превращения в свете фонарика', icon: '✳', sentences: [
    sentence('Ве-че-ром ре-бя-та у-стро-и-ли до-маш-ний те-атр.'),
    sentence('Со-ня на-пра-ви-ла фо-на-рик на бе-лу-ю сте-ну.'),
    sentence('Паль-цы пре-вра-ти-лись в у-ши ска-зоч-но-го зай-ца.'),
    sentence('Зри-те-ли за-хло-па-ли, ког-да за-яц по-кло-нил-ся.'),
  ] },
  { id: 'map', difficulty: 'hard', title: 'Карта сокровищ', caption: 'Неожиданная находка в саду', icon: '♧', sentences: [
    sentence('Ти-мо-фей на-ри-со-вал кар-ту ба-буш-ки-но-го са-да.'),
    sentence('Из-ви-лис-та-я до-рож-ка ве-ла к ста-рой яб-ло-не.'),
    sentence('Под де-ре-вом ре-бя-та об-на-ру-жи-ли ко-ро-боч-ку.'),
    sentence('Вну-три ле-жа-ли раз-но-цвет-ны-е ка-меш-ки и за-пис-ка.'),
  ] },
];

export const filterStories = (difficulty: Difficulty | 'all') => stories.filter(story => difficulty === 'all' || story.difficulty === difficulty);
export const sentenceText = (words: string[][]) => words.map(word => word.join('')).join(' ');
export type Step = { sentence: number; mode: Mode; word: number; syllable: number };
export function createSteps(story: Story, selected: readonly Mode[]): Step[] {
  return story.sentences.flatMap((words, sentence) => modes.filter(mode => selected.includes(mode)).flatMap(mode => {
    if (mode === 'syllables') return words.flatMap((parts, word) => parts.map((_, syllable): Step => ({ sentence, mode, word, syllable })));
    return Array.from({ length: mode === 'sentence' ? 1 : words.length }, (_, word): Step => ({ sentence, mode, word, syllable: 0 }));
  }));
}
