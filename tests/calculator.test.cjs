const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const source = html.match(/<script id="calculator-script">([\s\S]*?)<\/script>/)[1].split("const form = document")[0];
const calculate = vm.runInNewContext(`${source}; calculateCost`);
const cost = (changes={}) => calculate({enhancement:'attack',level:1,building:1,previous:0,hexes:2,multiple:false,lost:false,actionPersistent:false,persistent:false,...changes}).total;

test('base costs and X / level 1',() => {
  assert.equal(cost(),50);
  assert.equal(cost({enhancement:'pull'}),20);
  assert.equal(cost({enhancement:'summonAttack'}),100);
  assert.equal(cost({enhancement:'immobilize'}),150);
});
test('multiple, loss, and persistent modifiers precede surcharges',() => {
  assert.equal(cost({multiple:true,lost:true,level:3,previous:1}),175);
  assert.equal(cost({multiple:true,persistent:true,actionPersistent:true,lost:true}),300);
  assert.equal(cost({actionPersistent:true,lost:true}),50);
  assert.equal(cost({lost:true,persistent:true}),75);
});
test('target, elements and area are exempt from multiple-target doubling',() => {
  for (const enhancement of ['target','element','wildElement','hex']) assert.equal(cost({enhancement,multiple:true}),cost({enhancement}));
});
test('summon persistent exception does not allow lost discount with persistent action',() => {
  assert.equal(cost({enhancement:'summonAttack',persistent:true,actionPersistent:true,lost:true}),100);
  assert.equal(cost({enhancement:'summonRange',persistent:true,multiple:true}),100);
});
test('building discounts accumulate and apply in correct order',() => {
  assert.equal(cost({building:2,multiple:true}),90);
  assert.equal(cost({building:3,level:3,previous:1}),145);
  assert.equal(cost({building:4,level:3,previous:1}),120);
  assert.equal(cost({building:4}),40);
  assert.equal(cost({building:4,enhancement:'pull',lost:true}),0);
});
test('hex base rounds up before other modifiers, without invented final rounding',() => {
  assert.equal(cost({enhancement:'hex',hexes:3}),67);
  assert.equal(cost({enhancement:'hex',hexes:3,lost:true}),33.5);
  assert.equal(cost({enhancement:'bless',lost:true}),37.5);
});
test('special cases and previous improvements on same action',() => {
  assert.equal(cost({enhancement:'damageTrap'}),50);
  assert.equal(cost({enhancement:'healingTrap'}),30);
  assert.equal(cost({enhancement:'tokenMove'}),30);
  assert.equal(cost({previous:5}),425);
});
test('invalid and unsafe numbers are rejected',() => {
  for (const changes of [{hexes:0},{previous:-1},{previous:0.5},{previous:NaN},{level:10},{building:0},{enhancement:'missing'},{previous:Number.MAX_SAFE_INTEGER}]) assert.throws(() => cost(changes),{name:'RangeError'});
});
