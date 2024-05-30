import { vec3 } from 'gl-matrix'

export default class AABB {
/**
 * @param {import('gl-matrix').ReadonlyVec3} pos
 * @param {import('gl-matrix').ReadonlyVec3} vec
 */
constructor(pos, vec) {

  var pos2 = vec3.create()
  vec3.add(pos2, pos, vec)
 
  this.base = vec3.min(vec3.create(), pos, pos2)
  this.vec = vec3.clone(vec)
  this.max = vec3.max(vec3.create(), pos, pos2)

  this.mag = vec3.length(this.vec)

}

/**
 * @returns {number}
 */
width() {
  return this.vec[0]
}

/**
 * @returns {number}
 */
height() {
  return this.vec[1]
}

/**
 * @returns {number}
 */
depth() {
  return this.vec[2]
}

/**
 * @returns {number}
 */
x0() {
  return this.base[0]
}

/**
 * @returns {number}
 */
y0() {
  return this.base[1]
}

/**
 * @returns {number}
 */
z0() {
  return this.base[2]
}

/**
 * @returns {number}
 */
x1() {
  return this.max[0]
}

/**
 * @returns {number}
 */
y1() {
  return this.max[1]
}

/**
 * @returns {number}
 */
z1() {
  return this.max[2]
}

/**
 * @param {import('gl-matrix').ReadonlyVec3} by
 * @returns {this}
 */
translate(by) {
  vec3.add(this.max, this.max, by)
  vec3.add(this.base, this.base, by)
  return this
}

/**
 * @param {import('gl-matrix').ReadonlyVec3} pos
 * @returns {this}
 */
setPosition(pos) {
  vec3.add(this.max, pos, this.vec)
  vec3.copy(this.base, pos)
  return this
}

/**
 * @param {AABB} aabb
 * @returns {AABB}
 */
expand(aabb) {
  var max = vec3.create()
    , min = vec3.create()

  vec3.max(max, aabb.max, this.max)
  vec3.min(min, aabb.base, this.base)
  vec3.subtract(max, max, min)

  return new AABB(min, max)
}

/**
 * @param {AABB} aabb
 * @returns {boolean}
 */
intersects(aabb) {
  if(aabb.base[0] > this.max[0]) return false
  if(aabb.base[1] > this.max[1]) return false
  if(aabb.base[2] > this.max[2]) return false
  if(aabb.max[0] < this.base[0]) return false
  if(aabb.max[1] < this.base[1]) return false
  if(aabb.max[2] < this.base[2]) return false

  return true
}

/**
 * @param {AABB} aabb
 * @returns {boolean}
 */
touches(aabb) {

  var intersection = this.union(aabb);

  return (intersection !== null) &&
         ((intersection.width() == 0) ||
         (intersection.height() == 0) || 
         (intersection.depth() == 0))

}

/**
 * @param {AABB} aabb
 * @returns {AABB | null}
 */
union(aabb) {
  if(!this.intersects(aabb)) return null

  var base_x = Math.max(aabb.base[0], this.base[0])
    , base_y = Math.max(aabb.base[1], this.base[1])
    , base_z = Math.max(aabb.base[2], this.base[2])
    , max_x = Math.min(aabb.max[0], this.max[0])
    , max_y = Math.min(aabb.max[1], this.max[1])
    , max_z = Math.min(aabb.max[2], this.max[2])

  return new AABB([base_x, base_y, base_z], [max_x - base_x, max_y - base_y, max_z - base_z])
}
}




