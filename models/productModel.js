const db = require("../config/database");

class Product {
  constructor({
    id,
    name,
    description,
    sku,
    category,
    unit,
    min_stock,
    current_stock,
    unit_price,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.sku = sku;
    this.category = category;
    this.unit = unit;
    this.min_stock = min_stock;
    this.current_stock = current_stock;
    this.unit_price = unit_price;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Tüm ürünler verisini çeken metod
  static async findAll() {
    try {
      const [rows] = await db.query("SELECT * FROM products");
      return rows.map((product) => new Product(product));
    } catch (err) {
      console.error("Product.findAll hata:", err);
      throw err;
    }
  }

  // ID bilgisiyle ürün verisi çekme metodu
  static async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
        id,
      ]);
      return rows.map((product) => new Product(product));
    } catch (err) {
      console.error("Product.findById hata:", err);
      throw err;
    }
  }

  // SKU (Stok kodu) bilgisiyle ürün verisi çekme metodu
  static async findBySku(sku) {
    try {
      const [rows] = await db.query("SELECT * FROM products WHERE sku = ?", [
        sku,
      ]);
      return rows.map((product) => new Product(product));
    } catch (err) {
      console.error("Product.findBySku hata:", err);
      throw err;
    }
  }

  // Ürün oluşturma metodu
  static async create(productData) {
    try {
      const [result] = await db.query(
        "INSERT INTO products (`name`, `description`, sku, unit, min_stock, current_stock, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          productData.name,
          productData.description,
          productData.sku,
          productData.unit,
          productData.min_stock,
          productData.current_stock,
          productData.unit_price,
        ]
      );
      return result.affectedRows > 0
        ? console.log("Ürün başarıyla oluşturuldu")
        : console.log("Ürün oluşturma hatası");
    } catch (err) {
      console.error("Product.create hata:", err);
      throw err;
    }
  }

  // Ürün güncelleme metodu
  static async update(id, productData) {
    try {
      const newName = productData.name || this.name;
      const newDescription = productData.description || this.description;
      const newSku = productData.sku || this.sku;
      const newUnit = productData.unit || this.unit;
      const newMinStock = productData.min_stock || this.min_stock;
      const newCurrentStock = productData.current_stock || this.current_stock;
      const newUnitPrice = productData.unit_price || this.unit_price;

      const [result] = await db.query(
        "UPDATE products SET `name` = ?, `description` = ?, sku = ?, unit = ?, min_stock = ?, current_stock = ?, unit_price = ? WHERE id = ?",
        [
          newName,
          newDescription,
          newSku,
          newUnit,
          newMinStock,
          newCurrentStock,
          newUnitPrice,
          id,
        ]
      );

      return result.affectedRows > 0
        ? console.log("Ürün başarıyla güncellendi")
        : console.log("Ürün güncelleme hatası");
    } catch (err) {
      console.error("Product.update hata:", err);
      throw err;
    }
  }

  // Ürün stok güncelleme metodu
  static async updateStock(id, newStock) {
    try {
      const [result] = await db.query(
        "UPDATE products SET current_stock = ? WHERE id = ?",
        [newStock, id]
      );

      return result.affectedRows > 0
        ? console.log("Ürün stok miktarı başarıyla güncellendi")
        : console.log("Ürün stok miktarı güncelleme hatası");
    } catch (err) {
      console.error("Product.updateStock hata:", err);
      throw err;
    }
  }

  // Ürün silme metodu
  static async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM products WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0
        ? console.log("Ürün başarıyla silindi")
        : console.log("Ürün silme hatası");
    } catch (err) {
      console.error("Product.delete hata:", err);
      throw err;
    }
  }

  // Düşük stoktaki ürünler verisini çekme metodu
  static async getLowStock() {
    try {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE current_stock < min_stock"
      );
      return rows.map((product) => new Product(product));
    } catch (err) {
      console.error("Product.getLowStock hata:", err);
      throw err;
    }
  }
}

module.exports = Product;
