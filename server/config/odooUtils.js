// server/odooUtils.js
const { odooClient } = require('./odooConfig');

const odooExecuteKw = (model, method, args = [], kwargs = {}) => {
  return new Promise((resolve, reject) => {
    odooClient.execute_kw(model, method, [args, kwargs], (err, result) => {
      if (err) {
        console.error(`❌ Odoo call failed: ${model}.${method}`);
        console.error('Args:', args, 'Kwargs:', kwargs);
        console.error('Error:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = { odooExecuteKw };
