/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator 0.14.0.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */
'use strict';
import { Product } from './product';
import { Invoice } from './invoice';
import { SubProduct } from './subProduct';
import { ProductListResult } from './productListResult';
import { ProductListResultNextLink } from './productListResultNextLink';
import { Pet } from './pet';
import { Cat } from './cat';
import { Dog } from './dog';
import { Fish } from './fish';
import { Shark } from './shark';
import { Sawshark } from './sawshark';
import { PetGallery } from './petgallery';
const discriminators = {
    'Fish': Fish,
    'Fish.shark': Shark,
    'Fish.sawshark': Sawshark,
    'Pet': Pet,
    'Pet.Cat': Cat,
    'Pet.Dog': Dog
};
export { Product, Invoice, SubProduct, ProductListResult, ProductListResultNextLink, Pet, Cat, Dog, Fish, Shark, Sawshark, PetGallery, discriminators };
//# sourceMappingURL=index.js.map