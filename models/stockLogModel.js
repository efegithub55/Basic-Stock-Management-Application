const db = require("../config/database");

class StockLog {
  constructor({
    id,
    product_id,
    user_id,
    type,
    quantity,
    previous_stock,
    new_stock,
    note,
  }) {
    (this.id = id),
      (this.product_id = product_id),
      (this.user_id = user_id),
      (this.type = type),
      (this.quantity = quantity),
      (this.previous_stock = previous_stock),
      (this.new_stock = new_stock),
      (this.note = note);
  }

  // Stok kaydı oluşturma
  static async create(logData) {
    try {
      const [result] = await db.query(
        "INSERT INTO stock_logs (product_id, user_id, type, quantity, previous_stock, new_stock, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          logData.product_id,
          logData.user_id,
          logData.type,
          logData.quantity,
          logData.previous_stock,
          logData.new_stock,
          logData.note || null,
        ]
      );
      return result.affectedRows > 0
        ? console.log("Stok kaydı başarıyla oluşturuldu")
        : console.log("Stok kaydı oluşturma hatası");
    } catch (err) {
      console.error("StockLog.create hata:", err);
      throw err;
    }
  }

  // Tüm denetim kaydı verisi çekme metodu
  static async findAll(filters = {}) {
    try {
      const {
        productId = null,
        userId = null,
        type = null,
        startDate = null,
        endDate = null,
        search = null,
        page = 1,
        limit = 50,
        sortBy = "created_at",
        sortOrder = "DESC",
      } = filters;

      var conditions = [];
      var params = [];

      if (productId) {
        conditions.push("sl.product_id = ?");
        params.push(productId);
      }

      if (userId) {
        conditions.push("sl.user_id = ?");
        params.push(userId);
      }

      if (type && (type == "giris" || type == "cikis")) {
        conditions.push("sl.type = ?");
        params.push(type);
      }

      if (startDate && endDate) {
        conditions.push("DATE(sl.created_at) BETWEEN ? AND ?");
        params.push(startDate, endDate);
      } else if (startDate) {
        conditions.push("DATE(sl.created_at) >= ?");
        params.push(startDate);
      } else if (endDate) {
        conditions.push("DATE(sl.created_at) <= ?");
        params.push(endDate);
      }

      if (search) {
        conditions.push("(p.name LIKE ? OR p.sku LIKE ?)");
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      const whereClause =
        conditions.length > 0 ? "WHERE" + conditions.join(" AND ") : "";

      const countQuery = `
        SELECT COUNT(*) AS total
        FROM stock_logs sl
        INNER JOIN products p ON sl.product_id p.id
        INNER JOIN users u ON sl.user_id u.id
        ${whereClause}
      `;

      const [countResult] = await db.query(countQuery, params);
      const total = countResult[0].total;

      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);

      const allowedSortFields = [
        "created_at",
        "quantity",
        "type",
        "product_name",
      ];
      const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "created_at";
      const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

      const dataQuery = `
        SELECT
          sl.id,
          sl.product_id,
          sl.user_id,
          sl.type,
          sl.quantity,
          sl.previous_stock,
          sl.next_stock,
          sl.note,
          sl.created_at,
          p.name AS product_name,
          p.sku AS product_sku,
          p.unit AS product_unit,
          u.username,
          u.email AS user_email,
          DATE_FORMAT(sl.created_at, '%d.%m%Y %H:%i:%s') AS formatted_date
        FROM stock_logs sl
        INNER JOIN products p ON sl.product_id = p.id
        INNER JOIN users u ON sl.user_id = u.id
        ${whereClause}
        ORDER BY ${
          safeSortBy === "product_name" ? "p.name" : "sl." + safeSortBy
        } ${safeSortOrder}
        LIMIT = ? OFFSET = ?
      `;

      const queryParams = [...params, limit, offset];

      const [rows] = await db.query(dataQuery, queryParams);
      return {
        success: true,
        data: rows,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (err) {
      console.error("StockLog.findAll hata:", err);
      throw err;
    }
  }

  // Ürün ID ile veri çekme metodu
  static async findByProductId(productId) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM stock_logs WHERE product_id = ?",
        [productId]
      );

      return rows.map((product) => new StockLog(product));
    } catch (err) {
      console.error("StockLog.findByProductId hata:", err);
      throw err;
    }
  }
}

module.exports = StockLog;
