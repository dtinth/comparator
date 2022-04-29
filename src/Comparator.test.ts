import { Comparator } from './Comparator';

describe('naturalOrder', () => {
  it('returns negative number when a < b', () => {
    const comparator = Comparator.naturalOrder();
    expect(comparator(1, 2)).toBe(-1);
  });
  it('returns positive number when a > b', () => {
    const comparator = Comparator.naturalOrder();
    expect(comparator(2, 1)).toBe(1);
  });
  it('returns negative number when a === b', () => {
    const comparator = Comparator.naturalOrder();
    expect(comparator(1, 1)).toBe(0);
  });
});

describe('reverseOrder', () => {
  it('returns positive number when a < b', () => {
    const comparator = Comparator.reverseOrder();
    expect(comparator(1, 2)).toBe(1);
  });
  it('returns negative number when a > b', () => {
    const comparator = Comparator.reverseOrder();
    expect(comparator(2, 1)).toBe(-1);
  });
  it('returns negative number when a === b', () => {
    const comparator = Comparator.reverseOrder();
    expect(comparator(1, 1)).toBe(0);
  });
});

type Tuple = [number, number];

describe('comparing', () => {
  it('checks by key', () => {
    const comparator0 = Comparator.comparing((t: Tuple) => t[0]);
    const comparator1 = Comparator.comparing((t: Tuple) => t[1]);
    expect(comparator0([1, 2], [2, 1])).toBe(-1);
    expect(comparator0([1, 2], [2, 2])).toBe(-1);
    expect(comparator0([1, 1], [1, 2])).toBe(0);
    expect(comparator1([1, 2], [2, 1])).toBe(1);
    expect(comparator1([1, 2], [2, 2])).toBe(0);
    expect(comparator1([1, 1], [1, 2])).toBe(-1);
  });
  it('allows key comparator', () => {
    const comparator0 = Comparator.comparing(
      (t: Tuple) => t[0],
      Comparator.reverseOrder(),
    );
    const comparator1 = Comparator.comparing(
      (t: Tuple) => t[1],
      Comparator.reverseOrder(),
    );
    expect(comparator0([1, 2], [2, 1])).toBe(1);
    expect(comparator0([1, 2], [2, 2])).toBe(1);
    expect(comparator0([1, 1], [1, 2])).toBe(0);
    expect(comparator1([1, 2], [2, 1])).toBe(-1);
    expect(comparator1([1, 2], [2, 2])).toBe(0);
    expect(comparator1([1, 1], [1, 2])).toBe(1);
  });
});

describe('thenComparing', () => {
  it('checks by key', () => {
    const comparator = Comparator.comparing((t: Tuple) => t[0]).thenComparing(
      (t) => t[1],
    );
    expect(comparator([1, 2], [2, 1])).toBe(-1);
    expect(comparator([2, 2], [2, 1])).toBe(1);
    expect(comparator([2, 2], [2, 3])).toBe(-1);
    expect(comparator([3, 2], [2, 3])).toBe(1);
    expect(comparator([3, 3], [2, 3])).toBe(1);
    expect(comparator([3, 3], [3, 3])).toBe(0);
  });
  it('allows key comparator', () => {
    const comparator = Comparator.comparing((t: Tuple) => t[0]).thenComparing(
      (t) => t[1],
      Comparator.reverseOrder(),
    );
    expect(comparator([1, 2], [2, 1])).toBe(-1);
    expect(comparator([2, 2], [2, 1])).toBe(-1);
    expect(comparator([2, 2], [2, 3])).toBe(1);
    expect(comparator([3, 2], [2, 3])).toBe(1);
    expect(comparator([3, 3], [2, 3])).toBe(1);
    expect(comparator([3, 3], [3, 3])).toBe(0);
  });
});

describe('reversed', () => {
  it('reverses order', () => {
    const comparator = Comparator.comparing((t: string) => t.length).reversed();
    expect(comparator('a', 'b')).toBe(0);
    expect(comparator('aa', 'b')).toBe(-1);
    expect(comparator('aa', 'bbbb')).toBe(1);
  });
});

describe('real-world test', () => {
  it('can order strings by length, then by alphabet, putting lower-case first', () => {
    const words =
      `In the early days of the internet, JavaScript was the language that brought interactive elements to web pages. From its humble beginnings as a way to make web pages more interactive, JavaScript has become one of the most popular programming languages in the world. Today, JavaScript is used to create web applications, mobile applications, and even some desktop applications.`.match(
        /\w+/g,
      ) as string[];
    words.sort(
      Comparator.comparing((w: string) => w.length)
        .thenComparing((w) => w.toLowerCase())
        .thenComparingBy(Comparator.reverseOrder()),
    );
    expect(words).toMatchInlineSnapshot(`
      Array [
        "a",
        "as",
        "in",
        "In",
        "is",
        "of",
        "of",
        "to",
        "to",
        "to",
        "and",
        "has",
        "its",
        "one",
        "the",
        "the",
        "the",
        "the",
        "the",
        "was",
        "way",
        "web",
        "web",
        "web",
        "days",
        "even",
        "From",
        "make",
        "more",
        "most",
        "some",
        "that",
        "used",
        "early",
        "pages",
        "pages",
        "Today",
        "world",
        "become",
        "create",
        "humble",
        "mobile",
        "brought",
        "desktop",
        "popular",
        "elements",
        "internet",
        "language",
        "languages",
        "beginnings",
        "JavaScript",
        "JavaScript",
        "JavaScript",
        "interactive",
        "interactive",
        "programming",
        "applications",
        "applications",
        "applications",
      ]
    `);
  });
});
