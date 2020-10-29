import { Environment } from "./Environment"

class User {
    fullName() {
        return ''
    }
}

const data = {
    objects: {
        users: {}
    }
}

const models = {
    User
}

const env = new Environment(data, models);
console.log(env);