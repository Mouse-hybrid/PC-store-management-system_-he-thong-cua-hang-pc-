/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // 1. Xóa toàn bộ dữ liệu hiện có trong bảng games để làm sạch
  await knex('games').del();

  // 2. Bơm 7 tựa game theo đúng yêu cầu tài liệu
  await knex('games').insert([
    {
      name: 'Caro hàng 5',
      slug: 'caro-5',
      instructions: 'Nối 5 quân cờ liên tiếp cùng màu theo hàng ngang, dọc hoặc chéo để chiến thắng.',
      board_size: JSON.stringify({ width: 20, height: 20 }),
      is_active: true
    },
    {
      name: 'Caro hàng 4',
      slug: 'caro-4',
      instructions: 'Nối 4 quân cờ liên tiếp cùng màu để chiến thắng.',
      board_size: JSON.stringify({ width: 15, height: 15 }),
      is_active: true
    },
    {
      name: 'Tic-Tac-Toe',
      slug: 'tic-tac-toe',
      instructions: 'Luân phiên đánh dấu X hoặc O. Nối 3 dấu liên tiếp để thắng.',
      board_size: JSON.stringify({ width: 3, height: 3 }),
      is_active: true
    },
    {
      name: 'Rắn săn mồi',
      slug: 'snake',
      instructions: 'Điều khiển hướng đi để ăn mồi. Không được chạm tường hoặc chạm vào đuôi.',
      board_size: JSON.stringify({ width: 20, height: 20 }),
      is_active: true
    },
    {
      name: 'Ghép hàng 3',
      slug: 'match-3',
      instructions: 'Đổi chỗ 2 khối cạnh nhau để tạo thành hàng hoặc cột từ 3 khối cùng màu trở lên.',
      board_size: JSON.stringify({ width: 8, height: 8 }),
      is_active: true
    },
    {
      name: 'Cờ trí nhớ',
      slug: 'memory',
      instructions: 'Lật từng cặp ô để tìm các màu/hình giống nhau. Cần hoàn thành trong thời gian ngắn nhất.',
      board_size: JSON.stringify({ width: 4, height: 4 }),
      is_active: true
    },
    {
      name: 'Bảng vẽ tự do',
      slug: 'free-draw',
      instructions: 'Sử dụng các màu sắc để thỏa sức vẽ lên ma trận.',
      board_size: JSON.stringify({ width: 30, height: 30 }),
      is_active: true
    }
  ]);
};