export const formatDateFields = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (value instanceof Date) return [key, value.toISOString().split('T')[0]];
      return [key, value];
    })
  );
};
