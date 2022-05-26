
const tasks = require('../tasks');

exports.seed = function(knex, Promise) {
  return knex('tasks').del()
    .then(function () {
      return knex('tasks').insert(tasks);
    });
};

