export const diedYoung = {
  'Curt Cobein': {
    name: 'Curt Cobein',
    age: 27,
    desc: 'Kurt Donald Cobain was an American musician who was best known as the lead singer, guitarist, and primary' +
      ' songwriter of the grunge band Nirvana',
    category: 'music',
  },
  'John Lennon': {
    name: 'John Lennon',
    age: 40,
    desc: 'John Winston Ono Lennon MBE was an English singer and songwriter who rose to worldwide fame as a' +
      ' co-founder of the band the Beatles, the most commercially successful band in the history of popular music',
    category: 'music',
  },
  'Elvis Presley': {
    name: 'Elvis Presley',
    age: 42,
    desc: 'Elvis Aaron Presley was an American singer and actor. Regarded as one of the most significant cultural' +
      ' icons of the 20th century, he is often referred to as "the King of Rock and Roll", or simply, "the King".',
    category: 'music',
  },
  'Bob Marley': {
    name: 'Bob Marley',
    age: 36,
    desc: 'Robert Nesta "Bob" Marley OM was a Jamaican reggae singer-songwriter, musician, and guitarist who' +
      ' achieved international fame and acclaim.',
    category: 'music',
  },
  'Heinrich Hertz': {
    name: 'Heinrich Hertz',
    age: 36,
    desc: `In a series of brilliant experiments Heinrich Hertz discovered radio waves and established that James Clerk Maxwell’s theory
     of electromagnetism is correct. Hertz also discovered the photoelectric effect, providing one of the first clues to the existence
      of the quantum world. The unit of frequency, the hertz, is named in his honor.`,
    category: 'science',
  },
  'Ada Lovelace': {
    name: 'Ada Lovelace',
    age: 36,
    desc: `Ada Lovelace was a pioneer of computing science. She took part in writing the first published program and was
     a computing visionary, recognizing for the first time that computers could output more than just calculations.`,
    category: 'science',
  },
  'Bernhard Riemann': {
    name: 'Bernhard Riemann',
    age: 39,
    desc: `Bernhard Riemann was a mathematician who made a difference. He produced the first rigorous formulation of the
     integral; discovered Riemann surfaces; and put forward the Riemann hypothesis.`,
    category: 'science',
  },
  'Henry Moseley': {
    name: 'Henry Moseley',
    age: 27,
    desc: `In 1913, Henry Moseley discovered that every chemical element’s identity is determined by its number of protons.
     In doing so, he discovered the true basis of the periodic table.`,
    category: 'science',
  },
  'Joan of Arc ': {
    name: 'Joan of Arc ',
    age: 19,
    desc: `The patron saint of France, Joan of Arc inspired a French revolt against the occupation of the English.
     An unlikely heroine; at the age of just 17, the diminutive Joan successfully led the French to victory at Orleans.
      Her later trial and martyrdom only heightened her mystique.`,
    category: 'history',
  },
  'Buddy Holly': {
    name: 'Buddy Holly',
    age: 22,
    desc: 'American musician and pioneer of Rock and Roll',
    category: 'music',
  },
  'Bruce Lee': {
    name: 'Bruce Lee',
    age: 32,
    desc: `Hong Kong – American martial artist, actor and film-maker. Lee was most influential martial artist of all time. `,
    category: 'actor',
  },
  'Jesus Christ': {
    name: 'Jesus Christ',
    age: 33,
    desc: 'Spiritual teacher, who gave main teachings in the gospels of New Testament. Principle inspiration for' +
      ' Christianity.',
    category: 'history'
  },
  'Alexander the Great': {
    name: 'Alexander the Great',
    age: 33,
    desc: `King of Macedonia, he established an Empire from the Ionian Sea to the Himalayas in India.`,
    category: 'history',
  },
  'Aryton Senna':  {
    name: 'Aryton Senna',
    age: 34,
    desc: `Brazilian motor racing champion. Three times Formula One world champion (’88,’90,’91).`,
    category: 'sport',
  },
  'Wolfgang Amadeus Mozart': {
    name: 'Wolfgang Amadeus Mozart',
    age: 35,
    desc: `Composing from the age of 6, Mozart was a musical genius and one of the greatest classical composers of all time.`,
    category: 'music',
  },
  'Marilyn Monroe ': {
    name: 'Marilyn Monroe ',
    age: 36,
    desc: `American singer, model and actress. Monroe became one of most famous cultural icons in the world.`,
    category: 'actor',
  },
  'Vincent Van Gogh ': {
    name: 'Vincent Van Gogh ',
    age: 37,
    desc: `Dutch post-impressionist painter. Developed unique and ground-breaking style, which had huge influence on modern art.`,
    category: 'artist',
  },
  'Florence Griffith Joyner': {
    name: 'Florence Griffith Joyner',
    age: 39,
    desc: ' Olympian sprinter. Olympic gold in 100m and 200m and still holds world record for the 100m and 200m.',
    category: 'sport',
  },
  'Martin Luther King': {
    name: 'Martin Luther King',
    age: 39,
    desc: 'American civil rights campaigner. Martin Luther King led the non-violent civil rights movement being at' +
      ' the forefront of the sweeping social change of the 1960s.',
    category: 'history',

  }
};

export const diedYoungArray = Object.values(diedYoung).sort((first, second) => first.age > second.age ? 1 : -1);

export const getDiedByYears = () => {
  const randomSortedDead = Object.values(diedYoung).sort(() => Math.random() > 0.5 ? 1 : -1);
  const diedByYears = [];
  randomSortedDead.forEach(dead => {
    if (!diedByYears.find(died => died.age === dead.age)) {
      diedByYears.push(dead);
    }
  });
  return diedByYears.sort((first, second) => first.age > second.age ? 1 : -1);
};
