export interface Comparator<T> {
  (a: T, b: T): number;
}

export interface ComparatorX<T> extends Comparator<T> {
  reversed(): ComparatorX<T>;
  thenComparing<U>(
    keyExtractor: (value: T) => U,
    keyComparator?: Comparator<U>,
  ): ComparatorX<T>;
  thenComparingBy(other: Comparator<T>): ComparatorX<T>;
}

export namespace Comparator {
  export function comparing<T, U>(
    keyExtractor: (value: T) => U,
    keyComparator: Comparator<U> = naturalOrder(),
  ): ComparatorX<T> {
    return ComparatorX.from((a, b) =>
      keyComparator(keyExtractor(a), keyExtractor(b)),
    );
  }

  export function naturalOrder<T>(): ComparatorX<T> {
    return ComparatorX.from((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  export function reverseOrder<T>(): ComparatorX<T> {
    return ComparatorX.from((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  }
}

export namespace ComparatorX {
  export function from<T>(comparator: Comparator<T>): ComparatorX<T> {
    return Object.assign(comparator, {
      reversed: () => from<T>((a, b) => comparator(b, a)),
      thenComparing: <U>(
        keyExtractor: (value: T) => U,
        keyComparator: Comparator<U> = Comparator.naturalOrder(),
      ) => {
        return from<T>(
          (a, b) =>
            comparator(a, b) || keyComparator(keyExtractor(a), keyExtractor(b)),
        );
      },
      thenComparingBy: (other: Comparator<T>) => {
        return from<T>((a, b) => comparator(a, b) || other(a, b));
      },
    });
  }
}
