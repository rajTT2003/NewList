require('dotenv').config();
const { odooExecuteKw } = require('./config/odooUtils');
const { odooClient } = require('./config/odooConfig');

// ── 1. Get Products ─────────────────────────────────────────────────────
const getProducts = async () => {
  try {
    // Debug: Print unique product types to verify what's available (e.g., 'product', 'service', 'combo')
    const typeCheck = await odooExecuteKw(
      'product.template',
      'search_read',
      [[]], // ← Correct domain format
      { fields: ['type'], limit: 100 } // ← Correct kwargs format
    );
    console.log('👀 Unique product types:', [...new Set(typeCheck.map(t => t.type))]);

    const limit = 100;
    let offset = 0;
    const templates = [];

    // Filter to only 'sale_ok' and 'type' in ['product', 'combo']
    const domain = [['sale_ok', '=', true], ['type', 'in', ['consu', 'combo']]];

    while (true) {
      const batch = await odooExecuteKw(
        'product.template',
        'search_read',
        [domain],
        {
          fields: [
            'id', 'name', 'list_price', 'default_code', 'description_sale',
            'categ_id', 'product_variant_ids', 'qty_available', 'image_1920', 'type'
          ],
          limit,
          offset,
        }
      );
      if (!batch.length) break;
      templates.push(...batch);
      offset += limit;
    }

    const variantIds = Array.from(
      new Set(templates.flatMap(t => t.product_variant_ids || []))
    );

    const variants = variantIds.length
      ? await odooExecuteKw(
          'product.product',
          'read',
          [variantIds],
          {
            fields: [
              'id', 'name', 'list_price', 'default_code', 'qty_available',
              'image_1920', 'standard_price', 'price_extra',
              'product_template_variant_value_ids'
            ]
          }
        )
      : [];

    const allTemplateValueIds = Array.from(
      new Set(variants.flatMap(v => v.product_template_variant_value_ids || []))
    );

    const attributeValues = allTemplateValueIds.length
      ? await odooExecuteKw(
          'product.template.attribute.value',
          'read',
          [allTemplateValueIds],
          {
            fields: ['id', 'name', 'attribute_id', 'price_extra']
          }
        )
      : [];

    const attrValueMap = Object.fromEntries(attributeValues.map(val => [
      val.id,
      {
        id: val.id,
        value_name: val.name,
        attribute_name: val.attribute_id?.[1] || 'Unknown',
        price_extra: val.price_extra || 0
      }
    ]));

    const vmap = Object.fromEntries(variants.map(v => {
      const attributes = (v.product_template_variant_value_ids || [])
        .map(valId => attrValueMap[valId])
        .filter(Boolean);
      return [
        v.id,
        {
          ...v,
          image: v.image_1920 ? `data:image/png;base64,${v.image_1920}` : null,
          cost: v.standard_price,
          price: v.list_price,
          attributes,
        }
      ];
    }));

    // Updated logic to determine if the product is a variant-able product
// inside your getProducts() after you've built `vmap`…
return templates.map(tpl => {
  // Map IDs → enriched variant objects
  const fullVariants = (tpl.product_variant_ids || [])
    .map(vid => vmap[vid])
    .filter(Boolean);

  // TRUE only if there’s more than one variant ID
  const isVariant = Array.isArray(tpl.product_variant_ids) && tpl.product_variant_ids.length > 1;

  return {
    ...tpl,
    category_name: tpl.categ_id?.[1] || null,
    image: tpl.image_1920 ? `data:image/png;base64,${tpl.image_1920}` : null,
    variants: fullVariants,
    is_variant_product: isVariant
  };
});


  } catch (err) {
    console.error('❌ getProducts error:', err);
    return [];
  }
};


// ── 2. Get Categories ───────────────────────────────────────────────────
const getCategories = async () => {
  try {
    return await odooExecuteKw(
      'product.category',
      'search_read',
      [],
      { fields: ['id', 'name', 'parent_id'], limit: 100 }
    );
  } catch (err) {
    console.error('getCategories error:', err);
    return [];
  }
};

// ── 3. Placeholder for createSaleOrder ──────────────────────────────────
// No longer used since sales module is removed
const createSaleOrder = async () => {
  console.warn('createSaleOrder is deprecated (salesClient removed).');
  return null;
};

// ── 4. Placeholder for getActiveDiscounts ───────────────────────────────
const getActiveDiscounts = async () => {
  console.warn('getActiveDiscounts is deprecated (salesClient removed).');
  return [];
};



// ── 5. Get Product by ID ──────────────────────────────────────────────
const getProductById = async (productId) => {
  try {
    const pid = parseInt(productId);

    // Step 1: Try to fetch as a variant
    const [variant] = await odooExecuteKw(
      'product.product',
      'search_read',
      [[['id', '=', pid]]],
      {
        fields: [
          'id', 'name', 'product_tmpl_id', 'list_price', 'default_code',
          'qty_available', 'image_1920', 'standard_price', 'price_extra',
          'product_template_variant_value_ids'
        ]
      }
    );

    if (variant && variant.product_tmpl_id) {
      const templateId = variant.product_tmpl_id[0];

      // Fetch the template
      const [template] = await odooExecuteKw(
        'product.template',
        'search_read',
        [[['id', '=', templateId]]],
        {
          fields: [
            'id', 'name', 'list_price', 'default_code', 'description_sale',
            'categ_id', 'product_variant_ids', 'qty_available', 'image_1920', 'type'
          ]
        }
      );

      const variantIds = template?.product_variant_ids || [];

      if (variantIds.length > 1) {
        const allVariants = await odooExecuteKw(
          'product.product',
          'read',
          [variantIds],
          {
            fields: [
              'id', 'name', 'list_price', 'default_code',
              'qty_available', 'image_1920', 'standard_price', 'price_extra',
              'product_template_variant_value_ids'
            ]
          }
        );

        const allValueIds = Array.from(
          new Set(allVariants.flatMap(v => v.product_template_variant_value_ids || []))
        );

        const attributeValues = allValueIds.length
          ? await odooExecuteKw(
              'product.template.attribute.value',
              'read',
              [allValueIds],
              {
                fields: ['id', 'name', 'attribute_id', 'price_extra']
              }
            )
          : [];

        const attrValueMap = Object.fromEntries(attributeValues.map(val => [
          val.id,
          {
            id: val.id,
            value_name: val.name,
            attribute_name: val.attribute_id?.[1] || 'Unknown',
            price_extra: val.price_extra || 0
          }
        ]));

        const fullVariants = allVariants.map(v => {
          const attributes = (v.product_template_variant_value_ids || [])
            .map(valId => attrValueMap[valId])
            .filter(Boolean);

          return {
            id: v.id,
            name: v.name,
            price: v.list_price,
            cost: v.standard_price,
            sku: v.default_code,
            quantity: v.qty_available,
            image: v.image_1920 ? `data:image/png;base64,${v.image_1920}` : null,
            attributes,
          };
        });

        return {
          id: template.id,
          name: template.name,
          description: template.description_sale || null,
          category_name: template.categ_id?.[1] || null,
          price: template.list_price,
          sku: template.default_code,
          quantity: template.qty_available,
          image: template.image_1920 ? `data:image/png;base64,${template.image_1920}` : null,
          is_variant_product: true,
          variants: fullVariants,
          initial_variant_id: variant.id // 🔥 Add this line
        };
      }
    }

    // Step 2: Non-variant or fallback
    const [template] = await odooExecuteKw(
      'product.template',
      'search_read',
      [[['id', '=', pid]]],
      {
        fields: [
          'id', 'name', 'list_price', 'default_code', 'description_sale',
          'categ_id', 'product_variant_ids', 'qty_available', 'image_1920', 'type'
        ]
      }
    );

    if (!template) throw new Error(`Product with ID ${productId} not found.`);

    const variantIds = template.product_variant_ids || [];

    const variants = variantIds.length
      ? await odooExecuteKw(
          'product.product',
          'read',
          [variantIds],
          {
            fields: [
              'id', 'name', 'list_price', 'default_code',
              'qty_available', 'image_1920', 'standard_price', 'price_extra',
              'product_template_variant_value_ids'
            ]
          }
        )
      : [];

    const allValueIds = Array.from(
      new Set(variants.flatMap(v => v.product_template_variant_value_ids || []))
    );

    const attributeValues = allValueIds.length
      ? await odooExecuteKw(
          'product.template.attribute.value',
          'read',
          [allValueIds],
          {
            fields: ['id', 'name', 'attribute_id', 'price_extra']
          }
        )
      : [];

    const attrValueMap = Object.fromEntries(attributeValues.map(val => [
      val.id,
      {
        id: val.id,
        value_name: val.name,
        attribute_name: val.attribute_id?.[1] || 'Unknown',
        price_extra: val.price_extra || 0
      }
    ]));

    const fullVariants = variants.map(v => {
      const attributes = (v.product_template_variant_value_ids || [])
        .map(valId => attrValueMap[valId])
        .filter(Boolean);

      return {
        id: v.id,
        name: v.name,
        price: v.list_price,
        cost: v.standard_price,
        sku: v.default_code,
        quantity: v.qty_available,
        image: v.image_1920 ? `data:image/png;base64,${v.image_1920}` : null,
        attributes,
      };
    });

    return {
      id: template.id,
      name: template.name,
      description: template.description_sale || null,
      category_name: template.categ_id?.[1] || null,
      price: template.list_price,
      sku: template.default_code,
      quantity: template.qty_available,
      image: template.image_1920 ? `data:image/png;base64,${template.image_1920}` : null,
      is_variant_product: fullVariants.length > 1,
      variants: fullVariants,
      initial_variant_id: fullVariants[0]?.id || null // use first variant as fallback
    };
  } catch (err) {
    console.error(`❌ getProductById(${productId}) error:`, err);
    throw err;
  }
};


module.exports = {
  getProducts,
  getCategories,
  createSaleOrder,
  getActiveDiscounts,
  getProductById, // ✅ add this
};
