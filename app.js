const persons = [
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
function superName(person) {
  return person.name;
}
function isTeacher(person) {
  return person.profession === 'teacher';
}
function isPeter(person) {
  return person.name === 'Peter';
}

function query() {
  const actions = {};

  actions.filterCallbackStack = [];
  actions.selectCallback = undefined;
  actions.result = undefined;
  actions.groupByCallback = undefined;

  actions.select = function (callback = null) {
    if (actions.selectCallback !== undefined) {
      throw new Error('Duplicate SELECT');
    }

    actions.selectCallback = callback;

    return actions;
  };

  actions.from = function (objectsArray = null) {
    if(actions.result !== undefined) {
      throw new Error('Duplicate FROM');
    }
    
    actions.result = objectsArray;

    return actions;
  };
  
  actions.where = function(filter = null) {
    if(filter) {
      actions.filterCallbackStack.push(filter)
    }

    return actions;
  }

  actions.groupBy = function(group) {
    if(actions.groupByCallback !== undefined) {
      throw new Error('Duplicate GROUP BY');
    }
    
    actions.groupByCallback = group;

    return actions;
  }

  actions.execute = function () {
    let res = actions.result || [];

    // Execute where =>
    res = res.filter((el) => {
      return actions.filterCallbackStack.every(callback => callback(el));
    })

    // Execute groupBy =>
    const tmp = res.map();
    console.log(tmp)

    // Execute select =>
    res = res.map((el) => {
      if (actions.selectCallback) {
        return actions.selectCallback(el)
      }

      return el;
    });

    return res;
  };

  return actions;
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

query().select().from(persons).groupBy(profession).execute(); 


// console.log(first)

// console.log(query().select().select().execute()) // "Error('Duplicate SELECT')"
// console.log(query().select().from([]).select().execute()) // "Error('Duplicate SELECT')"
// console.log(query().select().from([]).from([]).execute()); //Error('Duplicate FROM');


// const numbers = [1, 2, 3];
// console.log(query().select().execute(), [])
// console.log(query().from(numbers).execute(), [1, 2, 3])
// console.log(query().execute(), [])