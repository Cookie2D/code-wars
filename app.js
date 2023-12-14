var persons = [
  { name: "Peter", profession: "teacher", age: 20, maritalStatus: "married" },
  { name: "Michael", profession: "teacher", age: 50, maritalStatus: "single" },
  { name: "Peter", profession: "teacher", age: 20, maritalStatus: "married" },
  { name: "Anna", profession: "scientific", age: 20, maritalStatus: "married" },
  { name: "Rose", profession: "scientific", age: 50, maritalStatus: "married" },
  { name: "Anna", profession: "scientific", age: 20, maritalStatus: "single" },
  { name: "Anna", profession: "politician", age: 50, maritalStatus: "married" },
];

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 
function descendentCompare(number1, number2) {
  return number2 - number1;
}
function profession(person) {
  return person.profession;
}
function name(person) {
  return person.name;
}
function age(person) {
  return person.age;
}
function isTeacher(person) {
  return person.profession === "teacher";
}
function isPeter(person) {
  return person.name === "Peter";
}
function odd(group) {
  return group[0] === 'odd';
}
function isEven(number) {
  return number % 2 === 0;
}
function parity(number) {
  return isEven(number) ? 'even' : 'odd';
}
function lessThan3(number) {
  return number < 3;
}
function greaterThan4(number) {
  return number > 4;
}

function naturalCompare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 > value2) {
    return 1;
  } else {
    return 0;
  }
}

function professionCount(group) {
  console.log("enteredGROUP", group);
  return [group[0], group[1].length];
}

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

  actions.from = function (objectsArray = null) {
    if (actions.result !== undefined) {
      throw new Error("Duplicate FROM");
    }

    actions.result = objectsArray;

    return actions;
  };

  actions.where = function (...filters) {
    if (filters) {
      console.log(filters);
      actions.filterCallbackStack.push(...filters);
      console.log(this.filterCallbackStack)
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

  actions.having = function(have) {
    if(actions.havingCallback !== undefined) {
      
    }

    actions.havingCallback = have;

    return actions;
  }

  actions.execute = function () {
    let res = actions.result || [];

    // Execute where =>
    if(this.filterCallbackStack.length) {
      res = res.filter((el) => {
        return actions.filterCallbackStack.some((callback) => callback(el));
      });
    }

    // Execute groupBy =>
    if (actions.groupByCallback) {
      res = group(res, actions.groupByCallback);
    }

    // Execute orderBy =>
    if (actions.orderByCallback) {
      console.log('order')
      res = deepSort(res, actions.orderByCallback);
    }

    // Execute having =>
    if(actions.havingCallback) {
      res = res.filter(el => actions.havingCallback(el))
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
      if(Array.isArray(a[0])) {
        return callback(a[0], b[0])
      }
      return callback(a,b);
    });
}

// console.log(
//   query()
//     .select(profession)
//     // .from()
//     // .select(superName)
//     .from(persons)
//     .where(isTeacher)
//     .where(isPeter)
//     .execute()
// );

const res = query().select().from(numbers).execute()
console.log(res);

// const res = query()
//   .select(professionCount)
//   .from(persons)
//   .groupBy(profession)
//   .orderBy(naturalCompare)
//   .execute();
// console.log(JSON.stringify(res));
// console.log(
//   JSON.stringify([
//     ["politician", 1],
//     ["scientific", 3],
//     ["teacher", 3],
//   ]),
//   "expect"
// );

// console.log(first)

// console.log(query().select().select().execute()) // "Error('Duplicate SELECT')"
// console.log(query().select().from([]).select().execute()) // "Error('Duplicate SELECT')"
// console.log(query().select().from([]).from([]).execute()); //Error('Duplicate FROM');

// const numbers = [1, 2, 3];
// console.log(query().select().execute(), [])
// console.log(query().from(numbers).execute(), [1, 2, 3])
// console.log(query().execute(), [])

module.exports = { query };
