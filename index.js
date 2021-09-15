export const loadItems = (datas) => {
  // const { items, recipes } = datas;
  const items = new Map();
  const recipes = new Map();

  for (const item of datas.items) {
    items.set(item.name, item);
  }

  // Init recipes
  for (const i in datas.recipes) {
    const recipe = datas.recipes[i];
    const needs = [];
    for (const j in recipe.needs) {
      const need = recipe.needs[j];
      const item = items.get(need[0]);
      if (!item) {
        console.warn(`Item ${need[0]} not found in recipe ${i}`);
        continue;
      }
      needs.push({
        item: items.get(need[0]),
        amount: need[1]
      });
    }
    recipe.needs = needs;

    recipes.set(+i, recipe);
  }

  // Items recipe
  for (const item of items.values()) {
    if (item.recipes) {
      const _recipes = [];

      for (const recipeKey of item.recipes) {
        const recipe = recipes.get(recipeKey);
        if (!recipe) {
          console.warn(`Recipe ${recipe} not found in item ${item.name}`);
          continue;
        }
        _recipes.push(recipe);
      }

      item.recipes = _recipes;
    }
  }

  return {
    items,
    recipes
  };
};

export const calculateItem = (item, amount, dataset, option = {}) => {
  const needs = new Map();

  const optionRecipe = option[item.name];

  const recipe = (optionRecipe || optionRecipe === null) ? optionRecipe : item.recipes?.[0];

  if (recipe) {
    for (const need of recipe.needs) {
      const _need = calculateItem(need.item, need.amount * amount, dataset, option);
      calcResultMerge(needs, _need);
    }

    return needs;
  } else {
    const _need = new Map();
    _need.set(item.name, {
      item,
      amount
    });

    return _need;
  }
};

const calcResultMerge = (one, two) => {
  for (const key of two.keys()) {
    if (one.get(key)) {
      one.set(key, {
        item: one.get(key).item,
        amount: one.get(key).amount + two.get(key).amount
      });
    } else {
      one.set(key, two.get(key));
    }
  }
};
