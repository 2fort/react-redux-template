// inspired by material-ui
export function createBreakpoints() {
  const keys = ['xs', 'sm', 'md', 'lg', 'xl'];

  const values = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  };

  const unit = 'px';

  const step = 5;

  function up(key) {
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (min-width:${value}${unit})`;
  }

  function down(key) {
    const endIndex = keys.indexOf(key) + 1;
    const upperbound = values[keys[endIndex]];

    if (endIndex === keys.length) {
      // xl down applies to all sizes
      return up('xs');
    }

    const value = typeof upperbound === 'number' && endIndex > 0 ? upperbound : key;
    return `@media (max-width:${value - step / 100}${unit})`;
  }

  function between(start, end) {
    const endIndex = keys.indexOf(end) + 1;

    if (endIndex === keys.length) {
      return up(start);
    }

    return (
      `@media (min-width:${values[start]}${unit}) and ` +
      `(max-width:${values[keys[endIndex]] - step / 100}${unit})`
    );
  }

  function only(key) {
    return between(key, key);
  }

  function width(key) {
    return values[key];
  }

  return {
    keys,
    values,
    up,
    down,
    between,
    only,
    width,
  };
}

export function sortAsc(fieldName) {
  return (a, b) => {
    if (!fieldName) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }

    if (a[fieldName] < b[fieldName]) return -1;
    if (a[fieldName] > b[fieldName]) return 1;
    return 0;
  };
}

export function sortDes(fieldName) {
  return (a, b) => {
    if (!fieldName) {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    }

    if (a[fieldName] > b[fieldName]) return -1;
    if (a[fieldName] < b[fieldName]) return 1;
    return 0;
  };
}
