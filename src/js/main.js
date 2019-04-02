function getProducedByFactoryPerSecond() {
  return 1 / this.productionCycleTime * this.numberProducedPerCycle;
}

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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    productionCycleTime: 10,
    numberProducedPerCycle: 1,
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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
    baseProducedByFactoryPerSecond: getProducedByFactoryPerSecond,
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

function getBaseProductionRateIngredientsPerSecond(finalProductName) {
  let finalProduct = itemDictionary[finalProductName];
  let ingredientsPerSingleItem = getAllIngredientsPerSingleItem(finalProductName);
  for (let ingredient in ingredientsPerSingleItem) {
    if (ingredientsPerSingleItem.hasOwnProperty(ingredient)) {
      ingredientsPerSingleItem[ingredient] /= finalProduct.productionCycleTime;
    }
  }
  return ingredientsPerSingleItem;
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
  let ingredientsPerSecondList = getBaseProductionRateIngredientsPerSecond(finalProductName);
  for (let ingredient in ingredientsPerSecondList) {
    if (ingredientsPerSecondList.hasOwnProperty(ingredient)) {
      if(!itemDictionary[ingredient].isPrimitive) {
        ingredientsPerSecondList[ingredient] /= itemDictionary[ingredient].baseProducedByFactoryPerSecond();
      } else {
        ingredientsPerSecondList[ingredient] = "Primitive";
      }

    }
  }
  return ingredientsPerSecondList;
}

function addIngredient(name, factoryRatio) {
  let newRow = document.getElementById('ingredient-table-body').insertRow(0);
  let nameCell = newRow.insertCell(0);
  nameCell.append(document.createTextNode(name));
  let factoryRatioCell = newRow.insertCell(1);
  factoryRatioCell.append(document.createTextNode(factoryRatio));

}

function itemSearched() {
  document.getElementById('ingredient-table-body').innerHTML = "";
  let inputText = document.getElementById('final-product').value;
  let factoryRatios = getBaseFactoryRatios(inputText);
  for (let ingredient in factoryRatios) {
    if (factoryRatios.hasOwnProperty(ingredient)) {
      addIngredient(ingredient, factoryRatios[ingredient]);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
});
document.getElementById('go-button').addEventListener('click', itemSearched);
