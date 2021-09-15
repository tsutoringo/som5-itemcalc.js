import { loadItems, calculateItem } from './index.js';
import fs from 'fs/promises';

const loadJSON = async path => fs.readFile(path, 'utf8').then(data => JSON.parse(data));

const loadedItems = loadItems({
  items: await loadJSON('./items.json'),
  recipes: await loadJSON('./recipes.json'),
});

const formatStack = stack => `${Math.floor(stack / 64)}st ${stack % 64}`;

(() => {
  const { items } = loadedItems;

  const result = calculateItem(
    items.get('鋼鉄製のツルハシ3'),
    1,
    loadedItems,
    {
      '鋼鉄製のツルハシ2': null,
    }
  );

  for (const r of result.values()) {
    console.log(`${r.item.name} ${formatStack(r.amount)}`);
  }
})();
