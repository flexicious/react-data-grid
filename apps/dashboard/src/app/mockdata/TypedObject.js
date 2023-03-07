/**
 * This class is the base class for all Flexicious classes. It defines the basis for the
 * Object oriented design, by implementing the "implementsOrExtends" function, which is a
 * replacement for the "is" keyword from other OO languages.
 * @namespace flexiciousNmsp
 * @class TypedObject
 * @name TypedObject
 */
export class TypedObject {
    typeCache = {};
    constructor() {
        if (this.constructed) {
            this.constructed();
        }
    }

    constructed() {
        //override me
    }

    /**
     * Returns true if the class name to check is in the list of class names defined for this class.
     * @method implementsOrExtends
     * @param name Name of the class to check
     * @return {Boolean}
     */
    implementsOrExtends(name) {
        if (this.typeCache[name] !== undefined) {
            return this.typeCache[name];
        }
        let i;
        let className;
        const names = this.getClassNames();
        for (i = 0; i < names.length; i += 1) {
            className = names[i];
            if (className === name) {
                this.typeCache[name] = true;
                return true;
            }
        }
        this.typeCache[name] = false;
        return false;
    }

    /**
     * Returns a list of strings that represent the object hierarchy for this object.
     * @return {Array}
     * @method getClassNames
     */
    getClassNames() {
        return ["TypedObject"];
    }
}
