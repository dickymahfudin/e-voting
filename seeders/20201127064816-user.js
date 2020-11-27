"use strict";
const bcrypt = require("bcrypt");
const user = require("../data/user.json");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let temp = [];
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        const e = user[key];
        const date = { createdAt: new Date(), updatedAt: new Date() };
        const uid = await bcrypt.hash(e.uid, 10);
        temp.push({ ...e, uid, ...date });
      }
    }
    await queryInterface.bulkInsert("Users", temp);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
