import fs from 'fs';
import path from 'path';
import db from './db.js';
import logger from '../logging/logger.js';

/**
 * Tự động nạp các tệp SQL Logic vào Database
 */
export const initializeSqlLogic = async () => {
  try {
    const sqlFolderPath = path.join(process.cwd(), 'db', 'sql-logic');
    
    // ĐÃ ĐỒNG BỘ: Tên tệp khớp hoàn toàn với các file bạn đã cung cấp
    const sqlFiles = [
      'Function Pc_store.sql',       // Chứa hàm f_get_real_stock...
      'Views_Procedures pc_store.sql', // Chứa v_bill_details và các Procedure
      'Trigger pc_store.sql'         // Chứa các bộ tự động hóa kho hàng
    ];

    logger.info('🚀 Bắt đầu đồng bộ SQL Logic vào Database...');

    for (const fileName of sqlFiles) {
      const filePath = path.join(sqlFolderPath, fileName);

      if (fs.existsSync(filePath)) {
        let sqlContent = fs.readFileSync(filePath, 'utf8');

        if (sqlContent.trim()) {
          /**
           * LƯU Ý QUAN TRỌNG: 
           * Các file SQL của bạn có chứa lệnh "DELIMITER $$". 
           * Đây là lệnh của CLI, thư viện mysql2 sẽ báo lỗi nếu để nguyên.
           * Chúng ta cần loại bỏ các dòng DELIMITER trước khi thực thi qua db.raw().
           */
          const cleanSql = sqlContent
            .replace(/DELIMITER \$\$/g, '')
            .replace(/DELIMITER ;/g, '')
            .replace(/\$\$/g, ';');

          await db.raw(cleanSql);
          logger.info(`✅ Đã nạp thành công logic từ: ${fileName}`);
        }
      } else {
        logger.warn(`⚠️ File không tìm thấy tại đường dẫn: ${filePath}`);
      }
    }

    logger.info('✨ Toàn bộ hệ thống Procedures, Triggers và Functions đã sẵn sàng!');
  } catch (error) {
    logger.error(`❌ Lỗi đồng bộ SQL Logic: ${error.message}`);
  }
};