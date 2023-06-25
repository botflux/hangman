export class InvalidLetterError extends Error {
  name = InvalidLetterError.name

  constructor(letter: string) {
    super(`The string must be exactly one letter, "${letter}" passed.`);
  }
}