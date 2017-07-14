/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("./index");
/**
 * @class
 * Initializes a new instance of the Dog class.
 * @constructor
 * @member {string} [food]
 *
 */
class Dog extends models.Pet {
    /**
     * Defines the metadata of Dog
     *
     * @returns {object} metadata of Dog
     *
     */
    mapper() {
        return {
            required: false,
            serializedName: 'dog',
            type: {
                name: 'Composite',
                className: 'Dog',
                modelProperties: {
                    id: {
                        required: false,
                        serializedName: 'id',
                        type: {
                            name: 'Number'
                        }
                    },
                    name: {
                        required: false,
                        serializedName: 'name',
                        type: {
                            name: 'String'
                        }
                    },
                    pettype: {
                        required: true,
                        serializedName: 'pet\\.type',
                        type: {
                            name: 'String'
                        }
                    },
                    food: {
                        required: false,
                        serializedName: 'food',
                        type: {
                            name: 'String'
                        }
                    }
                }
            }
        };
    }
}
exports.Dog = Dog;
//# sourceMappingURL=dog.js.map