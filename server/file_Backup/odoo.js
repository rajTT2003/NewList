
// require('dotenv').config();
// const Odoo = require('odoo-xmlrpc');

// // ── 1. Connect helper ───────────────────────────────────────────────────────
// const connectToOdoo = (instance, label) =>
//   new Promise((resolve, reject) => {
//     instance.connect(err => {
//       if (err) {
//         console.error(`❌ Failed to connect to ${label}:`, err);
//         return reject(err);
//       }
//       console.log(`✅ Connected to ${label}`);
//       resolve();
//     });
//   });

// // ── 2. Instantiate your Odoo clients ────────────────────────────────────────
// const inventoryOdoo = new Odoo({
//   url: 'https://newlist.odoo.com',
//   db: 'newlist',
//   username: 'rajairethomas10@gmail.com',
//   password: process.env.inventory_api,
// });
// const salesOdoo = new Odoo({
//   url: 'https://newlist-sales.odoo.com',
//   db: 'newlist-sales',
//   username: 'rajairethomas10@gmail.com',
//   password: process.env.sales_api,
// });

// // ── 3. Wire them up at startup ──────────────────────────────────────────────
// ;(async () => {
//   try {
//     await connectToOdoo(inventoryOdoo, 'Inventory Odoo');
//     await connectToOdoo(salesOdoo,    'Sales Odoo');
//   } catch {
//     process.exit(1);
//   }
// })();

// // ── 4. Minimal wrapper around instance.execute_kw ───────────────────────────
// //     Always call: execute_kw(model, method, [ argsArray, kwargsObject ], callback)
// const odooExecuteKw = (instance, model, method, args = [], kwargs = {}) =>
//   new Promise((resolve, reject) => {
//     // Build the RPC params array:
//     const params = [args, kwargs];

//     // Call the built-in execute_kw with exactly 4 args:
//     instance.execute_kw(model, method, params, (err, result) => {
//       if (err) {
//         console.error(`❌ Odoo ${model}.${method} failed`);
//         console.error('   args   =', JSON.stringify(args));
//         console.error('   kwargs =', JSON.stringify(kwargs));
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });



// // ── Updated getProducts ───────────────────────────────────────────────────
// const getProducts = async () => {
//   try {
//     const limit = 100;
//     let offset = 0;
//     const templates = [];

//     // 1) Fetch all product templates in pages
//     while (true) {
//       console.log(`Fetching product.template offset=${offset}`);
//       const batch = await odooExecuteKw(
//         inventoryOdoo,
//         'product.template',
//         'search_read',
//         [],
//         {
//           fields: [
//             'id', 'name', 'list_price', 'default_code', 'description_sale',
//             'categ_id', 'product_variant_ids', 'qty_available', 'image_1920'
//           ],
//           limit,
//           offset,
//         }
//       );
//       if (!batch.length) break;
//       templates.push(...batch);
//       offset += limit;
//     }

//     // 2) Collect unique variant IDs
//     const variantIds = Array.from(
//       new Set(templates.flatMap(t => t.product_variant_ids || []))
//     );

//     // 3) Fetch all variants and their product_template_variant_value_ids
//     const variants = variantIds.length
//       ? await odooExecuteKw(
//           inventoryOdoo,
//           'product.product',
//           'read',
//           [variantIds],
//           {
//             fields: [
//               'id', 'name', 'list_price', 'default_code', 'qty_available',
//               'image_1920', 'standard_price', 'price_extra',
//               'product_template_variant_value_ids'
//             ]
//           }
//         )
//       : [];

//     // 4) Extract all unique product_template_variant_value_ids
//     const allTemplateValueIds = Array.from(
//       new Set(variants.flatMap(v => v.product_template_variant_value_ids || []))
//     );

//     // 5) Fetch product.template.attribute.value data
//     const attributeValues = allTemplateValueIds.length
//       ? await odooExecuteKw(
//           inventoryOdoo,
//           'product.template.attribute.value',
//           'read',
//           [allTemplateValueIds],
//           {
//             fields: ['id', 'name', 'attribute_id', 'price_extra']
//           }
//         )
//       : [];

//     // 6) Map template attribute value ID => detailed data
//     const attrValueMap = Object.fromEntries(attributeValues.map(val => [
//       val.id,
//       {
//         id: val.id,
//         value_name: val.name,
//         attribute_name: val.attribute_id?.[1] || 'Unknown',
//         price_extra: val.price_extra || 0
//       }
//     ]));

//     // 7) Map variant ID => enriched variant
//     const vmap = Object.fromEntries(variants.map(v => {
//       const attributes = (v.product_template_variant_value_ids || []).map(valId => attrValueMap[valId]).filter(Boolean);
//       return [
//         v.id,
//         {
//           ...v,
//           image: v.image_1920 ? `data:image/png;base64,${v.image_1920}` : null,
//           cost: v.standard_price,
//           price: v.list_price,
//           attributes,
//         }
//       ];
//     }));

//     // 8) Combine all data into final structure
//     return templates.map(tpl => {
//       const fullVariants = (tpl.product_variant_ids || []).map(vid => vmap[vid]).filter(Boolean);
//       return {
//         ...tpl,
//         category_name: tpl.categ_id?.[1] || null,
//         image: tpl.image_1920 ? `data:image/png;base64,${tpl.image_1920}` : null,
//         variants: fullVariants,
//       };
//     });

//   } catch (err) {
//     console.error('❌ getProducts error:', err);
//     return [];
//   }
// };

// // ── 6. getCategories ────────────────────────────────────────────────────────
// const getCategories = async () => {
//   try {
//     return await odooExecuteKw(
//       inventoryOdoo,
//       'product.category',
//       'search_read',
//       [], // args: no domain
//       { fields: ['id','name'], limit: 100 } // kwargs
//     );
//   } catch (err) {
//     console.error('❌ getCategories error:', err);
//     return [];
//   }
// };

// // ── 7. createSaleOrder → decrement inventory ───────────────────────────────
// const createSaleOrder = async orderData => {
//   try {
//     // 7.1 create the sale.order
//     const saleOrderId = await odooExecuteKw(
//       salesOdoo,
//       'sale.order',
//       'create',
//       [ // args: list of one record
//         {
//           partner_id: orderData.partner_id,
//           order_line: orderData.order_lines,
//         }
//       ]
//     );

//     // 7.2 decrement stock for each line
//     for (const line of orderData.order_lines) {
//       const [prod] = await odooExecuteKw(
//         inventoryOdoo,
//         'product.product',
//         'read',
//         [line.product_id],           // args: single-ID array
//         { fields: ['qty_available'] } // kwargs
//       );
//       const newQty = (prod.qty_available || 0) - line.product_uom_qty;

//       await odooExecuteKw(
//         inventoryOdoo,
//         'product.product',
//         'write',
//         [line.product_id],            // args: single-ID array
//         { qty_available: newQty }     // kwargs
//       );
//     }

//     return saleOrderId;
//   } catch (err) {
//     console.error('❌ createSaleOrder error:', err);
//     return null;
//   }
// };

// module.exports = { getProducts, getCategories, createSaleOrder };
