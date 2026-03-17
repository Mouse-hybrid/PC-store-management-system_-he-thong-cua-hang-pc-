import productSchemas from './schemas/product-schemas.js';
import orderSchemas from './schemas/order-schemas.js';
import userSchemas from './schemas/user-schemas.js';
import couponSchemas from './schemas/coupon-schemas.js';
import errorSchemas from './schemas/error-schemas.js';

export default {
  schemas: {
    ...productSchemas,
    ...orderSchemas,
    ...userSchemas,
    ...couponSchemas,
    ...errorSchemas,
  },
};