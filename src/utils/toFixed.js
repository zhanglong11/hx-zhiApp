export default function(value, mantissa = 2) {
  return _.isNumber(value) ? _.ceil(value, mantissa) : 0
}
