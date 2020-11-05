function isLogicalQuery(key) {
  return ["or", "nor", "not", "and"].includes(key);
}

function proccessQueryCondition(filter = {}) {
  return Object.entries(filter).reduce((acc, [key, operators]) => {
    if (isLogicalQuery(key)) {
      return {
        ...acc,
        ["$" + key]: proccessFieldLogical(operators),
      };
    } else {
      let stringOrObj =
        "isStr" in operators
          ? operators["isStr"]
          : proccessFieldComparison(operators);
      return {
        ...acc,
        [key]: stringOrObj,
      };
    }
  }, {});
}

function proccessFieldComparison(operators) {
  return Object.entries(operators).reduce(
    (acc, [operator, value]) => ({
      ...acc,
      ["$" + operator]: value,
    }),
    {}
  );
}

function proccessFieldLogical(filter) {
  return filter.reduce((acc, item) => {
    return [...acc, proccessQueryCondition(item)];
  }, []);
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const removeEmpty = (obj) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (!value) {
      delete obj[key];
    }
  });

  if (isEmpty(obj)) {
    return null;
  }
  return obj;
};

export { proccessQueryCondition, removeEmpty };
