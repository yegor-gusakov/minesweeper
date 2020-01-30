/**
 * Pipeline
 * @param {...Function} fns Any functions
 * @return {Function} Function for applying argument to pipeline
 */
export default function pipe(...fns) {
  return x => fns.reduce((v, f) => f(v), x);
}
