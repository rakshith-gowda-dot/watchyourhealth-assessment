function getValueByPath(obj, path) {
  if (Array.isArray(path)) {
    return path.map(p => getValueByPath(obj, p));
  }
  
  // Handle array queries like exercises[?(@.id==235)]
  if (path.includes('[?')) {
    const [arrayPath, query] = path.split(/\[|\]/);
    const array = getValueByPath(obj, arrayPath);
    
    if (!Array.isArray(array)) return null;
    
    // Simple query parsing for id matching
    const match = query.match(/\?\(@\.(\w+)==([^)]+)\)/);
    if (match) {
      const [_, field, value] = match;
      const cleanValue = value.replace(/['"]/g, '');
      const found = array.find(item => String(item[field]) === cleanValue);
      return found || null;
    }
    
    return null;
  }
  
  // Handle nested path access like vitalsMap.vitals.heart_rate
  return path.split('.').reduce((o, p) => {
    if (o && typeof o === 'object' && p in o) {
      return o[p];
    }
    return undefined;
  }, obj);
}

function classifyValue(value, ranges) {
  if (!ranges || value === undefined || value === null) return null;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return null;
  
  for (const range of ranges) {
    if (numValue >= range.min && numValue < range.max) {
      return range;
    }
  }
  return null;
}

module.exports = {
  getValueByPath,
  classifyValue
};