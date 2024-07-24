import userData from "./data/users.js";

import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { all } from "axios";

const db = await dbConnection();

try {
    const user1 = await userData.createUser('anam', 'stevens', 'anam@gmail.com', 'Anam', 'Qureshi');
    console.log(user1);
} catch (e) {
    console.log(e);
}