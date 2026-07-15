export function removeUndefined(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item));
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val === undefined) {
        const sensibleDefaults: Record<string, any> = {
          branding: 'tech-bold',
          idea: '',
          version: '1.0.0',
          provider: 'groq-deepseek',
          status: 'complete',
          generation_time: 0,
          confidence: 0,
          downloads: 0
        };
        newObj[key] = sensibleDefaults[key] !== undefined ? sensibleDefaults[key] : null;
      } else {
        newObj[key] = removeUndefined(val);
      }
    }
  }
  return newObj;
}
