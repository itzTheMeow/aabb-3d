import { vec3 } from 'gl-matrix'

import type { ReadonlyVec3 } from 'gl-matrix'

export default class AABB {
  readonly base: vec3
  readonly vec: vec3
  readonly max: vec3
  readonly mag: number

  constructor(pos: ReadonlyVec3, vec: ReadonlyVec3) {
    const pos2 = vec3.create()
    vec3.add(pos2, pos, vec)

    this.base = vec3.min(vec3.create(), pos, pos2)
    this.vec = vec3.clone(vec)
    this.max = vec3.max(vec3.create(), pos, pos2)

    this.mag = vec3.length(this.vec)
  }

  width(): number {
    return this.vec[0]
  }

  height(): number {
    return this.vec[1]
  }

  depth(): number {
    return this.vec[2]
  }

  x0(): number {
    return this.base[0]
  }

  y0(): number {
    return this.base[1]
  }

  z0(): number {
    return this.base[2]
  }

  x1(): number {
    return this.max[0]
  }

  y1(): number {
    return this.max[1]
  }

  z1(): number {
    return this.max[2]
  }

  /**
   * Moves the box. Returns itself.
   */
  translate(by: ReadonlyVec3): this {
    vec3.add(this.max, this.max, by)
    vec3.add(this.base, this.base, by)
    return this
  }

  setPosition(pos: ReadonlyVec3): this {
    vec3.add(this.max, pos, this.vec)
    vec3.copy(this.base, pos)
    return this
  }

  /**
   * Returns a new `aabb` that surrounds both `aabb`'s.
   */
  expand(aabb: AABB): AABB {
    const max = vec3.create()
    const min = vec3.create()

    vec3.max(max, aabb.max, this.max)
    vec3.min(min, aabb.base, this.base)
    vec3.subtract(max, max, min)

    return new AABB(min, max)
  }

  /**
   * Returns `true` if the two bounding boxes intersect (or touch at all.)
   */
  intersects(aabb: AABB): boolean {
    if (aabb.base[0] > this.max[0]) return false
    if (aabb.base[1] > this.max[1]) return false
    if (aabb.base[2] > this.max[2]) return false
    if (aabb.max[0] < this.base[0]) return false
    if (aabb.max[1] < this.base[1]) return false
    if (aabb.max[2] < this.base[2]) return false

    return true
  }

  touches(aabb: AABB): boolean {
    const intersection = this.union(aabb);

    return (intersection !== null) &&
           ((intersection.width() == 0) ||
           (intersection.height() == 0) ||
           (intersection.depth() == 0))
  }

  /**
   * Returns a new `aabb` representing the shared area of the
   * two `aabb`'s. returns `null` if the boxes don't intersect.
   */
  union(aabb: AABB): AABB | null {
    if (!this.intersects(aabb)) return null

    const base_x = Math.max(aabb.base[0], this.base[0])
    const base_y = Math.max(aabb.base[1], this.base[1])
    const base_z = Math.max(aabb.base[2], this.base[2])
    const max_x = Math.min(aabb.max[0], this.max[0])
    const max_y = Math.min(aabb.max[1], this.max[1])
    const max_z = Math.min(aabb.max[2], this.max[2])

    return new AABB([base_x, base_y, base_z], [max_x - base_x, max_y - base_y, max_z - base_z])
  }
}