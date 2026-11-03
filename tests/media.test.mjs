import test from 'node:test';
import assert from 'node:assert/strict';
import {
  media,
  foodPhoto,
  fallbackImage,
  isLegacyImage,
  resolveImageSource,
} from '../src/modules/core/utils/media.js';

test('retired bucket URLs are replaced, including encoded paths and Google Storage URLs', () => {
  const urls = [
    'https://firebasestorage.googleapis.com/v0/b/rippio.appspot.com/o/Products%2Fpizza.png?alt=media',
    'https://storage.googleapis.com/rippio.appspot.com/Products/pizza.png',
  ];
  for (const url of urls) {
    assert.equal(isLegacyImage(url), true);
    assert.equal(resolveImageSource(url, media.food.pizza), media.food.pizza);
  }
});

test('empty or non-string values use a local replacement', () => {
  for (const src of [null, undefined, '', '  ', false, 42]) {
    assert.equal(resolveImageSource(src, media.user), media.user);
  }
});

test('food photos match normalized names, categories, and an unknown dish', () => {
  assert.equal(
    foodPhoto('Pizza de champiñones', 'Más pedidas'),
    media.food.pizza,
  );
  assert.equal(foodPhoto('Especial de la casa', 'Asiática'), media.food.sushi);
  assert.equal(foodPhoto('Té frío'), media.food.drink);
  assert.equal(foodPhoto('Burrito de pollo'), media.food.sandwich);
  assert.equal(foodPhoto('Arroz con pollo'), media.food.rice);
  assert.equal(foodPhoto('Producto desconocido'), media.food.table);
});

test('avatars, restaurant logos and payment cards use their own artwork', () => {
  assert.equal(fallbackImage('avatar'), media.user);
  assert.equal(fallbackImage('restaurant'), media.restaurant);
  assert.equal(fallbackImage('payment-card'), media.card);
  assert.equal(fallbackImage('logo'), media.logo);
  assert.equal(fallbackImage('banner', 'Domino pizza'), media.food.pizza);
});
