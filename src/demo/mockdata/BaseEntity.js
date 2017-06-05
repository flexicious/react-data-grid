import { UIUtils, TypedObject } from '../components/LibraryImports'

/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
export default class BaseEntity extends TypedObject {
    constructor() {
        super();
        this.addedBy = null;
        this.addedDate = null;
        this.updatedBy = null;
        this.updatedDate = null;
        this.id = null;
    }

    getClassNames() {
        return ["BaseEntity"];
    }

    clone(deepClone) {
        if (typeof deepClone == "undefined") deepClone = true;

        const entity = this.createNew();
        entity.addedBy = this.addedBy;
        for (const levelProp in this) {
            if (UIUtils.isPrimitive(this[levelProp])) {
                entity[levelProp] = this[levelProp];
            }

            else if (this[levelProp] && deepClone && typeof this[levelProp]["splice"] == 'function') {
                entity[levelProp] = [];

                for (const item of this[levelProp]) {
                    entity[levelProp].push(item.clone(deepClone));
                }
            }
            else if (this[levelProp] && !(this[levelProp] instanceof Array) && this[levelProp].implementsOrExtends && this[levelProp].implementsOrExtends('BaseEntity'))
                entity[levelProp] = this[levelProp];
        }
        return entity;

    }

    createNew() {
        throw new Error("Psuedo abstract method, need to override");
    }
}

BaseEntity.prototype.typeName = BaseEntity.typeName = 'BaseEntity';//for quick inspection
flexiciousNmsp.BaseEntity = BaseEntity;

