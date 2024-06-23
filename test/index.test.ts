import { test } from 'node:test'
import { ok, strictEqual } from 'node:assert'
import aabb from '../src/index.js'

function random(n?: number): number {
  return Math.random() * (n || 10) + 1
}

function eps(x: number, y: number): boolean {
  return Math.abs(x - y) < 10e-5
}

test('translate works', function() {
  const w = random()
  const h = random()
  const d = random()
  const b = new aabb([0, 0, 0], [w, h, d])
  const tx = random()
  const ty = random()
  const tz = random()

  strictEqual(b.x0(), 0, 'x0 == 0')
  strictEqual(b.y0(), 0, 'y0 == 0')
  ok(eps(b.x1(), w), 'x1 == w')
  ok(eps(b.y1(), h), 'y1 == h')
  strictEqual(b.z0(), 0, 'z0 == 0')
  ok(eps(b.z1(), d), 'z1 == d')

  b.translate([tx, ty, tz])

  ok(eps(b.x0(), tx), 'x0 == tx')
  ok(eps(b.x1(), tx + w), 'x1 == tx + w')
  ok(eps(b.y0(), ty), 'y0 == ty')
  ok(eps(b.y1(), ty + h), 'y1 == ty + h')
  ok(eps(b.z0(), tz), 'z0 == tz')
  ok(eps(b.z1(), tz + d), 'z1 == tz + d')
})

test('setPosition works', function() {
  const fromx = random()
  const fromy = random()
  const fromz = random()
  const w = random()
  const h = random()
  const d = random()
  const b = new aabb([fromx, fromy, fromz], [w, h, d])
  const tox = random()
  const toy = random()
  const toz = random()

  ok(eps(b.x0(), fromx), 'x0 == fromx')
  ok(eps(b.y0(), fromy), 'y0 == fromy')
  ok(eps(b.z0(), fromz), 'z0 == fromz')
  ok(eps(b.x1(), fromx + w), 'x1 == fromx+w')
  ok(eps(b.y1(), fromy + h), 'y1 == fromy+h')
  ok(eps(b.z1(), fromz + d), 'z1 == fromz+d')

  b.setPosition([tox, toy, toz])

  ok(eps(b.x0(), tox), 'x0 == tox')
  ok(eps(b.y0(), toy), 'y0 == toy')
  ok(eps(b.z0(), toz), 'z0 == toz')
  ok(eps(b.x1(), tox + w), 'x1 == tox+w')
  ok(eps(b.y1(), toy + h), 'y1 == toy+h')
  ok(eps(b.z1(), toz + d), 'z1 == toz+d')
})

test('expand works', function() {
  const b0 = new aabb([0, 0, 0], [10, 10, 10])
  const b1 = new aabb([-5, -5, -5], [2, 2, 2])
  let b2: aabb;

  b2 = b0.expand(b1)

  ok(eps(b2.y1(), b0.y1()), 'outer y bound is 10')
  ok(eps(b2.x1(), b0.x1()), 'outer x bound is 10')
  ok(eps(b2.x0(), b1.x0()), 'inner x bound is -5')
  ok(eps(b2.y0(), b1.y0()), 'inner y bound is -5')
})

test('intersects works', function() {
  const b0 = new aabb([10, 10, 10], [10, 10, 10])
  let b1 = new aabb([0, 0, 0], [2, 2, 2])

  strictEqual(b0.intersects(b1), false, 'should not intersect (either axis)')

  b1 = new aabb([0, 0, 0], [20, 2, 2])
  strictEqual(b0.intersects(b1), false, 'should not intersect (x intersects)')

  b1 = new aabb([0, 0, 0], [2, 20, 2])
  strictEqual(b0.intersects(b1), false, 'should not intersect (y intersects)')

  b1 = new aabb([0, 0, 0], [2, 2, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (z intersects)')

  b1 = new aabb([21, 20, 20], [20, 20, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (y intersects base)')

  b1 = new aabb([20, 21, 20], [20, 20, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (x intersects base)')

  b1 = new aabb([20, 20, 21], [20, 20, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (z intersects base)')

  b1 = new aabb([20, 20, 20], [20, 20, 20])
  strictEqual(b0.intersects(b1), true, 'should intersect (b0 touches b1)')

  b1 = new aabb([12, 12, 12], [4, 4, 4])
  strictEqual(b0.intersects(b1), true, 'should intersect (b0 contains b1)')

  b1 = new aabb([-5, -5, -5], [20, 20, 20])
  strictEqual(b0.intersects(b1), true, 'should intersects (b0 contains b1)')

  b1 = new aabb([-5, -5, -5], [10, 10, 10])
  strictEqual(b0.intersects(b1), false, 'should not intersect (b0 does not contain b1)')
})

test('touches works', function() {
  const b0 = new aabb([10, 10, 10], [10, 10, 10])
  let b1 = new aabb([0, 0, 0], [10, 10, 10])

  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([10, 0, 0], [10, 10, 10])
  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([0, 10, 0], [10, 10, 10])
  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([0, 0, 10], [10, 10, 10])
  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([-10, -10, -10], [10, 10, 10])
  strictEqual(b0.touches(b1), false, 'should not touch')
})