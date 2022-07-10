const PocketBase = require("pocketbase");

const client = new PocketBase('http://localhost:8090');

client.Admins.authViaEmail("email@gmail.com", "password12");