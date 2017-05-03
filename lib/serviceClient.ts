// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

import RequestPipeline from './requestPipeline';
import ServiceClientCredentials from './credentials/serviceClientCredentials';
import BaseFilter from './filters/baseFilter';
import * as nodeFetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

export interface ServiceClientOptions {
  requestOptions?: nodeFetch.RequestInit;
  filters?: BaseFilter[];
}

export class ServiceClient {
  userAgentInfo: { value: Array<string> };
  pipeline: Function;

  constructor(credentials?: ServiceClientCredentials, options?: ServiceClientOptions) {
    if (!options) {
      options = {};
    }

    if (!options.requestOptions) {
      options.requestOptions = {};
    }

    if (!options.filters) {
      options.filters = [];
    }

    this.userAgentInfo = { value: [] };
    if (credentials && !credentials.signRequest) {
      throw new Error('credentials argument needs to implement signRequest method');
    }
    try {
      const packageJson = JSON.parse(fs.readFileSync('../package.json', { encoding: 'utf8' }));
      const moduleName = packageJson.name;
      const moduleVersion = packageJson.version;
      this.addUserAgentInfo(`${moduleName}/${moduleVersion}`);
    } catch (err) {
      //do nothing
    }

    this.pipeline = new RequestPipeline(options.filters, options.requestOptions).create();
  }

  /**
   * Adds custom information to user agent header
   * @param {any} additionalUserAgentInfo - information to be added to user agent header, as string.
   */
  addUserAgentInfo(additionalUserAgentInfo: string): void {
    if (this.userAgentInfo.value.indexOf(additionalUserAgentInfo) === -1) {
      this.userAgentInfo.value.push(additionalUserAgentInfo);
    }
    return;
  }

  /**
   * Attempts to find package.json for the given azure nodejs package.
   * If found, returns the name and version of the package by reading the package.json
   * If package.json is not found, returns a default value.
   * @param {string} managementClientDir - pass the directory of the specific azure management client.
   * @returns {object} packageJsonInfo - "name" and "version" of the desired package.
   */
  getPackageJsonInfo(managementClientDir: string): object {

    // algorithm:
    // package.json is placed next to the lib directory. So we try to find the lib directory first.
    // In most packages we generate via autorest, the management client directly lives in the lib directory
    // so, package.json could be found just one level above where management client lives.
    // In some packages (azure-arm-resource), management client lives at one level deeper in the lib directory
    // so, we have to traverse at least two levels higher to locate package.json.
    // The algorithm for locating package.json would then be, start at the current directory where management client lives
    // and keep searching up until the file is located. We also limit the search depth to 2, since we know the structure of 
    // the clients we generate.

    let packageJsonInfo = {
      name: 'NO_NAME',
      version: '0.0.0'
    };

    // private helper
    function _getLibPath(currentDir: string, searchDepth: number): string {
      if (searchDepth < 1) {
        return '';
      }

      // if current directory is lib, return current dir, otherwise search one level up.
      return (currentDir.endsWith('lib') || currentDir.endsWith('lib' + path.sep)) ?
        currentDir :
        _getLibPath(path.join(currentDir, '..'), searchDepth - 1);
    }

    let libPath = _getLibPath(managementClientDir, 2);
    if (libPath) {
      let packageJsonPath = path.join(libPath, '..', 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        let data = require(packageJsonPath);
        packageJsonInfo.name = data.name;
        packageJsonInfo.version = data.version;
      }
    }

    return packageJsonInfo;
  }
}