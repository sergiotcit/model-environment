import { DataSource } from './DataSource';
import { RepositoryCollection } from './Environment';
import { firstLetterLowerCase } from './helpers';
import { ModelType } from './ModelSource';
const pluralize = require('pluralize');

export class Repository {
  data: DataSource;
  name: string;
  model: ModelType;
  environment: RepositoryCollection;

  constructor(data: DataSource, name: string, model: any, environment: any) {
    this.data = data;
    this.name = name;
    this.model = model;
    this.environment = environment;
  }

  getClassObjects() {
    return this.data.objects[this.getClassPluralizedName()];
  }

  getClassPluralizedName() {
    return pluralize(firstLetterLowerCase(this.name));
  }

  findBy(prop: string, value: any) {
    let classObjects = this.getClassObjects();
    let foundObject = null;

    for (let objectId in classObjects) {
      let object = classObjects[objectId];
      if (object[prop] === value && !foundObject) {
        foundObject = this.createModelInstance(object);
      }
    }
    return foundObject;
  }

  getById(id: any) {
    let modelObject = null;
    const modelPluralizedName = this.getClassPluralizedName();
    const modelObjects = this.data.objects[modelPluralizedName];
    if (modelObjects) {
      const object = modelObjects[id];
      if (object) {
        modelObject = this.createModelInstance(object);
      }
    } else {
      throw new Error('Maybe you forgot to send the corresponding "' + modelPluralizedName + '" object in your objects hash on your Environment initialization');
    }
    return modelObject;
  }

  all() {
    const objects: any[] = [];
    const classObjects = this.getClassObjects();

    Object.keys(classObjects).forEach((id) => {
      const objectData = classObjects[id];
      objects.push(this.createModelInstance(objectData));
    });
    return objects;
  }

  findAllBy(prop: string, value: any) {
    const classObjects = this.getClassObjects();
    const objects = [];
    for (const objectId in classObjects) {
      const object = classObjects[objectId];
      if (object[prop] === value) {
        objects.push(this.createModelInstance(object));
      }
    }
    return objects;
  }

  createModelInstance(data: any) {
    const object = new this.model(data);
    object.env = () => this.environment;
    return object;
  }
}
