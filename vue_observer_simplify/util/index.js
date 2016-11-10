/* @flow */

// can we use __proto__?
export const hasProto = '__proto__' in {}

/**
 * Create a cached version of a pure function.
 */
export function cached(fn:Function):Function {
    const cache = Object.create(null)
    return function cachedFn(str:string):any {
        const hit = cache[str]
        return hit || (cache[str] = fn(str))
    }
}

/**
 * Define a property.
 */
export function def(obj:Object, key:string, val:any, enumerable ? : boolean ) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj:mixed):boolean {
    return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
export function isPlainObject(obj:any):boolean {
    return toString.call(obj) === OBJECT_STRING
}


/**
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj:Object, key:string):boolean {
    return hasOwnProperty.call(obj, key)
}

/**
 * Camelize a hyphen-delmited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str:string):string => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})


/**
 * Capitalize a string.
 */
export const capitalize = cached((str:string):string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
})


export const warn = (msg) => {
    console.error(`[warn]: ${msg} `)
}

/**
 * Remove an item from an array
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}


/**
 * Parse simple path.
 */
const bailRE = /[^\w\.\$]/
export function parsePath (path: string): any {
    if (bailRE.test(path)) {
        return
    } else {
        const segments = path.split('.')
        return function (obj) {
            for (let i = 0; i < segments.length; i++) {
                if (!obj) return
                obj = obj[segments[i]]
            }
            return obj
        }
    }
}


let _Set
/* istanbul ignore if */
// if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    // _Set = Set
// } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = class Set {
        set: Object;
        constructor () {
            this.set = Object.create(null)
        }
        has (key: string | number) {
        return this.set[key] !== undefined
    }
    add (key: string | number) {
        this.set[key] = 1
    }
    clear () {
        this.set = Object.create(null)
    }
// }
}

export { _Set }
