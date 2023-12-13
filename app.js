var persons = [
  { name: "Peter", profession: "teacher", age: 20, maritalStatus: "married" },
  { name: "Michael", profession: "teacher", age: 50, maritalStatus: "single" },
  { name: "Peter", profession: "teacher", age: 20, maritalStatus: "married" },
  { name: "Anna", profession: "scientific", age: 20, maritalStatus: "married" },
  { name: "Rose", profession: "scientific", age: 50, maritalStatus: "married" },
  { name: "Anna", profession: "scientific", age: 20, maritalStatus: "single" },
  { name: "Anna", profession: "politician", age: 50, maritalStatus: "married" },
];

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

function query() {
  const actions = {};

  actions.filterCallbackStack = [];
  actions.selectCallback = undefined;
  actions.result = undefined;
  actions.groupByCallback = undefined;

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

  actions.where = function (filter = null) {
    if (filter) {
      actions.filterCallbackStack.push(filter);
    }

    return actions;
  };

  actions.groupBy = function (...groups) {
    if (actions.groupByCallback !== undefined) {
      throw new Error("Duplicate GROUP BY");
    }

    actions.groupByCallback = groups;

    return actions;
  };

  actions.execute = function () {
    let res = actions.result || [];

    // Execute where =>
    res = res.filter((el) => {
      return actions.filterCallbackStack.every((callback) => callback(el));
    });

    // Execute groupBy =>
    if (actions.groupByCallback) {
      res = group(res, actions.groupByCallback);
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

const res = query().select().from(persons).groupBy(age).execute();
console.log(JSON.stringify(res));

// console.log(first)

// console.log(query().select().select().execute()) // "Error('Duplicate SELECT')"
// console.log(query().select().from([]).select().execute()) // "Error('Duplicate SELECT')"
// console.log(query().select().from([]).from([]).execute()); //Error('Duplicate FROM');

// const numbers = [1, 2, 3];
// console.log(query().select().execute(), [])
// console.log(query().from(numbers).execute(), [1, 2, 3])
// console.log(query().execute(), [])

module.exports = { query };
