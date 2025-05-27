const Odoo = require('odoo-xmlrpc');
require('dotenv').config();

const useDocker = process.env.USE_DOCKER_ODOO === '1';

const getOdooClient = (label) => {
  const config = useDocker
    ? {
        url: 'http://localhost:8069',
        db: 'NewList',
        username: 'rajairethomas10@gmail.com',
        password: process.env.DOCKER_ODOO_PASSWORD 
      }
    : {
        url: 'https://newlist.odoo.com',
        db: 'newlist',
        username: 'rajairethomas10@gmail.com',
        password: process.env.INVENTORY_ODOO_PASSWORD,
      };

  const client = new Odoo(config);
  client.connect(err => {
    if (err) console.error(`❌ Failed to connect to ${label}:`, err);
    else console.log(`✅ Connected to ${label}`);
  });

  return client;
};

const odooClient = getOdooClient(useDocker ? 'Odoo Docker' : 'Odoo Online');

module.exports = {
  odooClient,
};
