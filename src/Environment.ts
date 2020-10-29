import { Repository } from './Repository';
import { firstLetterLowerCase } from './helpers';
import { DataSource } from './DataSource';
import { ModelSource } from './ModelSource';
import { QueryModel } from './QueryModel';
const pluralize = require('pluralize');

export interface RepositoryCollection {
  [key: string]: Repository
}

interface ModelCollection {
  [key: string]: QueryModel
}

export class Environment {
  data: DataSource = { objects: {} };
  models: ModelSource = {};
  environment: RepositoryCollection = {};
  objects: ModelCollection = {};

  constructor(data: DataSource, models: ModelSource) {
    this.data = data;
    this.models = models;
    this.environment = {};

    this.initializeEnvironment();
    this.initializeObjects();
  }

  initializeEnvironment = () => {
    for (const modelName in this.models) {
      const modelClass = this.models[modelName];
      this.environment[modelName] = new Repository(this.data, modelName, modelClass, this.environment);
    }
  }

  initializeObjects = () => {
    const modelObjects: any = {};
    const modelNames: any = {};

    for (const modelName in this.models) {
      const pluralizedModelName = pluralize(firstLetterLowerCase(modelName));
      // We initialize the dictionaries
      modelObjects[pluralizedModelName] = {};
      modelNames[pluralizedModelName] = modelName;
    }

    Object.keys(this.data.objects).forEach(objectName => {
      const members = this.data.objects[objectName];
      Object.keys(members).forEach((memberName) => {
        if (this.models[modelNames[objectName]]) {
          modelObjects[objectName][memberName] = new this.models[modelNames[objectName]](this.objects[objectName][memberName]);
          modelObjects[objectName][memberName].env = () => this.environment;
        } else {
          console.log('Remember to add ' + objectName + ' To your models');
        }
      });
    });
    this.objects = modelObjects;
  }
}