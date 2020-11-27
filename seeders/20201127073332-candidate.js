"use strict";
const candidate = require("../data/candidate.json");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let temp = [];
    for (const key in candidate) {
      if (candidate.hasOwnProperty(key)) {
        const e = candidate[key];
        const date = { createdAt: new Date(), updatedAt: new Date() };
        temp.push({ ...e, ...date });
      }
    }
    await queryInterface.bulkInsert("Candidates", temp);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Candidates", null, {});
  },
};
