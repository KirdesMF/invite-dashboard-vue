/**
 * get a random number between min and max
 * @param min
 * @param max
 * @returns random number between min and max
 */
export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param days
 */
export function setAccessUpToDate(days: number) {
  const today = new Date();
  const accessDate = new Date(today.setDate(today.getDate() + days));

  return accessDate.toLocaleDateString();
}
