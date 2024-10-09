async function* mimicAi(
  input: string,
  minInterval: number = 40,
  maxInterval: number = 200,
): AsyncIterableIterator<string> {
  const tokens = input.split("");
  let chunk = "";

  for (let i = 0; i < tokens.length; i++) {
    chunk += tokens[i];

    const shouldYield = Math.random() > 0.7 || i === tokens.length - 1;

    if (shouldYield) {
      yield chunk;
      chunk = "";
      const delay = getSkewedRandomDelay(minInterval, maxInterval);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

function getSkewedRandomDelay(min: number, max: number): number {
  const t = Math.random();
  const skewed = t * t;
  return Math.floor(min + skewed * (max - min));
}

export default mimicAi;
