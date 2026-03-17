import db from '../db/db.js';

// Trước khi chạy toàn bộ test: Migrations và Seeds
beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

// Sau khi chạy xong: Đóng kết nối để không bị treo terminal
afterAll(async () => {
  await db.destroy();
});