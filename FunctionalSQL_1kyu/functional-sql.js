function query() {
  const actions = {};

  actions.filterCallbackStack = [];
  actions.selectCallback = undefined;
  actions.havingCallback = undefined;
  actions.orderByCallback = undefined;
  actions.groupByCallback = undefined;
  actions.result = undefined;

  actions.select = function (callback = null) {
    if (actions.selectCallback !== undefined) {
      throw new Error("Duplicate SELECT");
    }

    actions.selectCallback = callback;

    return actions;
  };

  actions.from = function (...objectsArrays) {
    if (actions.result !== undefined) {
      throw new Error("Duplicate FROM");
    }

    actions.result = join(objectsArrays);

    return actions;
  };

  actions.where = function (...filters) {
    if (filters) {
      actions.filterCallbackStack.push(filters);
    }

    return actions;
  };

  actions.orderBy = function (order) {
    if (actions.orderByCallback !== undefined) {
      throw new Error("Duplicate ORDERBY");
    }

    actions.orderByCallback = order;

    return actions;
  };

  actions.groupBy = function (...groups) {
    if (actions.groupByCallback !== undefined) {
      throw new Error("Duplicate GROUPBY");
    }

    actions.groupByCallback = groups;

    return actions;
  };

  actions.having = function (have) {
    if (actions.havingCallback !== undefined) {
    }

    actions.havingCallback = have;

    return actions;
  };

  actions.execute = function () {
    let res = actions.result || [];

    // Execute where =>
    if (this.filterCallbackStack.length) {
      res = res.filter((el) => filter(el, actions.filterCallbackStack));
    }

    // Execute groupBy =>
    if (actions.groupByCallback) {
      res = group(res, actions.groupByCallback);
    }

    // Execute orderBy =>
    if (actions.orderByCallback) {
      console.log("order");
      res = deepSort(res, actions.orderByCallback);
    }

    // Execute having =>
    if (actions.havingCallback) {
      res = res.filter((el) => actions.havingCallback(el));
    }

    // Execute select =>
    if (actions.selectCallback) {
      res = res.map((el) => {
        return actions.selectCallback(el);
      });
    }

    return res;
  };

  return actions;
}

function join(arrays) {
  if (arrays.length < 2) return arrays.flat();

  const [firstArray, secondArray] = arrays;
  const result = [];
  for (let i = 0; i < firstArray.length; i++) {
    const firstElement = firstArray[i];

    for (let j = 0; j < secondArray.length; j++) {
      const secondElement = secondArray[j];
      result.push([firstElement, secondElement]);
    }
  }

  return result;
}

function group(array, callbacks) {
  // refactore
  const callbackCopy = [...callbacks];
  const callback = callbackCopy.shift();

  const groups = array.reduce((acc, el) => {
    const group = callback(el);
    if (!acc?.[group]) acc[group] = [];
    acc[group].push(el);

    return acc;
  }, {});

  const grouped = Object.entries(groups).reduce((acc, [key, values]) => {
    let groups = [...values];

    if (callbackCopy.length) {
      groups = group(groups, callbackCopy);
    }

    const isDigit = !Number.isNaN(Number(key));

    acc.push([isDigit ? Number(key) : key, [...groups]]); // do it in more smart way!

    return acc;
  }, []);

  return grouped;
}

function deepSort(array, callback) {
  // do it readable
  return array
    .map((item, i, array) => {
      if (Array.isArray(item[1])) {
        item[1] = deepSort(item[1], callback);
      } else if (item[1] && item[1].length) {
        item[1] = item[1].sort((a, b) => callback(a[0], b[0]));
      }
      return item;
    })
    .sort((a, b) => {
      if (Array.isArray(a[0])) {
        return callback(a[0], b[0]);
      }
      return callback(a, b);
    });
}

function filter(element, filters) {
  let answer = true;

  for (let i = 0; i < filters.length; i++) {
    const callbacks = filters[i];

    if (answer && callbacks.length > 1) {
      answer = callbacks.some((callback) => callback(element));
      continue;
    }

    answer = answer && callbacks[0](element);
  }

  return answer;
}

module.exports = { query };
