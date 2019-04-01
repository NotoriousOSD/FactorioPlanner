const itemDictionary = {
  ironOre: {
    name: 'ironOre',
    isPrimitive: true
  },

  copperOre: {
    name: 'copperOre',
    isPrimitive: true
  },

  coal: {
    name: 'coal',
    isPrimitive: true
  },

  ironPlate: {
    name: 'ironPlate',
    isPrimitive: false,
    productionCycleTime: 3.2,
    numberProducedPerCycle: 1,
    ingredients: [
      {
        name: 'ironOre',
        amountNeeded: 1
      }
    ]
  },

  copperPlate: {
    name: 'copperPlate',
    isPrimitive: false,
    productionCycleTime: 3.2,
    numberProducedPerCycle: 1,
    ingredients: [
      {
        name: 'copperOre',
        amountNeeded: 1
      }
    ]
  },

  copperCable: {
    name: 'copperCable',
    isPrimitive: false,
    productionCycleTime: .5,
    numberProducedPerCycle: 2,
    ingredients: [
      {
        name: 'copperPlate',
        amountNeeded: 1
      }
    ]
  },

  plasticBar: {
    name: 'plasticBar',
    isPrimitive: false,
    productionCycleTime: 1,
    numberProducedPerCycle: 2,
    ingredients: [
      {
        name: 'coal',
        amountNeeded: 1
      },
      {
        name: 'petroleum',
        amountNeeded: 20
      }
    ]
  },

  electronicCircuit: {
    name: 'electronicCircuit',
    isPrimitive: false,
    productionCycleTime: .5,
    numberProducedPerCycle: 1,
    ingredients: [
      {
        name: 'copperCable',
        amountNeeded: 3
      },
      {
        name: 'ironPlate',
        amountNeeded: 1
      }
    ]
  },

  advancedCircuit: {
    name: 'advancedCircuit',
    isPrimitive: false,
    productionCycleTime: 6,
    numberProducedPerCycle: 1,
    ingredients: [
      {
        name: 'copperCable',
        amountNeeded: 4
      },
      {
        name: 'electronicCircuit',
        amountNeeded: 2
      },
      {
        name: 'plasticBar',
        amountNeeded: 2
      }
    ]
  },

  processingUnit: {
    name: 'processingUnit',
    isPrimitive: false,
    productionCycleTime: 6,
    numberProducedPerCycle: 1,
    ingredients: [
      {
        name: 'advancedCircuit',
        amountNeeded: 2
      },
      {
        name: 'electronicCircuit',
        amountNeeded: 20
      },
      {
        name: 'sulfuricAcid',
        amountNeeded: 5
      }
    ]
  },

  sulfuricAcid: {
    name: 'sulfuricAcid',
    isPrimitive: false,
    productionCycleTime: 1,
    numberProducedPerCycle: 50,
    ingredients: [
      {
        name: 'ironPlate',
        amountNeeded: 1
      },
      {
        name: 'sulfur',
        amountNeeded: 5
      },
      {
        name: 'water',
        amountNeeded: 100
      }
    ]
  },

  sulfur: {
    name: 'sulfur',
    isPrimitive: false,
    productionCycleTime: 1,
    numberProducedPerCycle: 2,
    ingredients: [
      {
        name: 'petroleum',
        amountNeeded: 30
      },
      {
        name: 'water',
        amountNeeded: 30
      }
    ]
  },

  water : {
    name : 'water',
    isPrimitive: true
  },

  petroleum : {
    name : 'petroleum',
    isPrimitive: true
  }

};
//use this to combine to JSON objects with a Key: Number format
function combineKeyNumberObjects(object1, object2, childIngredientNeededForParent, amountProducedPerCycleOfParent) {
  for (let object1Key in object1) {
    if (object1.hasOwnProperty(object1Key)) {
      if (object2[object1Key]) {
        object2[object1Key] += object1[object1Key] * childIngredientNeededForParent / amountProducedPerCycleOfParent;
      } else {
        object2[object1Key] = object1[object1Key] * childIngredientNeededForParent / amountProducedPerCycleOfParent;
      }
    }

  }
  return object2;
}

function getAllIngredientsPerSingleItem(finalProductName) {
  console.log(finalProductName);
  let finalProduct = itemDictionary[finalProductName];

  let ingredientList = {};
  finalProduct.ingredients.forEach(function(ingredient) {
    if (ingredientList[ingredient.name]) {
      ingredientList[ingredient.name] += ingredient.amountNeeded / finalProduct.numberProducedPerCycle;
    } else {
      ingredientList[ingredient.name] = ingredient.amountNeeded / finalProduct.numberProducedPerCycle;
    }
    if (!itemDictionary[ingredient.name].isPrimitive) {
      let allChildIngredients = getAllIngredientsPerSingleItem(ingredient.name);
      ingredientList = combineKeyNumberObjects(allChildIngredients, ingredientList, ingredient.amountNeeded, finalProduct.numberProducedPerCycle);
    }
  });
  return ingredientList;
}

function getIngredientsPerSecondForOneParentItemPerSecond(finalProductName) {
  let finalProduct = itemDictionary[finalProductName];
  let ingredientsPerSingleItem = getAllIngredientsPerSingleItem(finalProductName);
  for (let ingredient in ingredientsPerSingleItem) {
    if (ingredientsPerSingleItem.hasOwnProperty(ingredient)) {
      ingredientsPerSingleItem[ingredient] *= finalProduct.productionCycleTime;
    }
  }
  return ingredientsPerSingleItem;
}

function getBaseFactoryRatios(finalProductName) {
  let ingredientsPerSecondList = getIngredientsPerSecondForOneParentItemPerSecond(finalProductName);
  for (let ingredient in ingredientsPerSecondList) {
    if (ingredientsPerSecondList.hasOwnProperty(ingredient)) {
      ingredientsPerSecondList[ingredient] *= (itemDictionary[ingredient].productionCycleTime / itemDictionary[ingredient].numberProducedPerCycle);
    }
  }
  return ingredientsPerSecondList;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log(getBaseFactoryRatios('advancedCircuit'));
});
