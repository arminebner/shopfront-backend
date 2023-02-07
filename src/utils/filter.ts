const filter = (obj, keyToFilter) => {
  let keysToKeep = Object.keys(obj).filter(key => key !== keyToFilter)
  return keysToKeep.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
}

export default filter
