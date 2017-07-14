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
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("./product");
exports.Product = product_1.Product;
const invoice_1 = require("./invoice");
exports.Invoice = invoice_1.Invoice;
const subProduct_1 = require("./subProduct");
exports.SubProduct = subProduct_1.SubProduct;
const productListResult_1 = require("./productListResult");
exports.ProductListResult = productListResult_1.ProductListResult;
const productListResultNextLink_1 = require("./productListResultNextLink");
exports.ProductListResultNextLink = productListResultNextLink_1.ProductListResultNextLink;
const pet_1 = require("./pet");
exports.Pet = pet_1.Pet;
const cat_1 = require("./cat");
exports.Cat = cat_1.Cat;
const dog_1 = require("./dog");
exports.Dog = dog_1.Dog;
const fish_1 = require("./fish");
exports.Fish = fish_1.Fish;
const shark_1 = require("./shark");
exports.Shark = shark_1.Shark;
const sawshark_1 = require("./sawshark");
exports.Sawshark = sawshark_1.Sawshark;
const petgallery_1 = require("./petgallery");
exports.PetGallery = petgallery_1.PetGallery;
const discriminators = {
    'Fish': fish_1.Fish,
    'Fish.shark': shark_1.Shark,
    'Fish.sawshark': sawshark_1.Sawshark,
    'Pet': pet_1.Pet,
    'Pet.Cat': cat_1.Cat,
    'Pet.Dog': dog_1.Dog
};
exports.discriminators = discriminators;
//# sourceMappingURL=index.js.map