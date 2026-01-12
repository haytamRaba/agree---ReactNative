import * as SQLite from "expo-sqlite";

// Ouvrir la base de données
const db = SQLite.openDatabaseSync("agree.db");

// Initialiser la base de données
export const initDatabase = () => {
  try {
    // Table des produits
    db.execSync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        stock INTEGER DEFAULT 100,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table des clients
    db.execSync(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table des commandes
    db.execSync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );
    `);

    // Table des items de commande
    db.execSync(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    console.log("✅ Base de données initialisée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la DB:", error);
  }
};

// ============ PRODUITS ============

// Ajouter un produit
export const addProduct = (name, price, image, category, description) => {
  try {
    const result = db.runSync(
      "INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)",
      [name, price, image, category, description]
    );
    console.log("✅ Produit ajouté avec succès");
    return result.lastInsertRowId;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du produit:", error);
    return null;
  }
};

// Ajouter des produits initiaux (seed data)
export const seedProducts = () => {
  try {
    const count = db.getFirstSync("SELECT COUNT(*) as count FROM products");

    if (count.count === 0) {
      const products = [
        {
          name: "Fresh Salad",
          price: 8.99,
          image: "🥗",
          category: "Salads",
          description: "Fresh green salad with organic vegetables",
        },
        {
          name: "Green Smoothie",
          price: 6.99,
          image: "🥤",
          category: "Drinks",
          description: "Healthy green smoothie",
        },
        {
          name: "Avocado Toast",
          price: 9.99,
          image: "🥑",
          category: "Breakfast",
          description: "Whole grain toast with fresh avocado",
        },
        {
          name: "Veggie Bowl",
          price: 12.99,
          image: "🥙",
          category: "Bowls",
          description: "Nutritious veggie bowl",
        },
        {
          name: "Fruit Salad",
          price: 7.99,
          image: "🍇",
          category: "Desserts",
          description: "Fresh seasonal fruits",
        },
        {
          name: "Green Juice",
          price: 5.99,
          image: "🥬",
          category: "Drinks",
          description: "Fresh green juice",
        },
        {
          name: "Veggie Burger",
          price: 10.99,
          image: "🍔",
          category: "Mains",
          description: "Plant-based burger",
        },
        {
          name: "Broccoli Bowl",
          price: 8.99,
          image: "🥦",
          category: "Bowls",
          description: "Steamed broccoli bowl",
        },
      ];

      const statement = db.prepareSync(
        "INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)"
      );

      products.forEach((product) => {
        statement.executeSync([
          product.name,
          product.price,
          product.image,
          product.category,
          product.description,
        ]);
      });

      console.log("✅ Produits initiaux ajoutés");
    }
  } catch (error) {
    console.error("❌ Erreur lors du seed des produits:", error);
  }
};

// Récupérer tous les produits
export const getAllProducts = () => {
  try {
    const result = db.getAllSync("SELECT * FROM products ORDER BY id");
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des produits:", error);
    return [];
  }
};

// Récupérer un produit par ID
export const getProductById = (id) => {
  try {
    const result = db.getFirstSync("SELECT * FROM products WHERE id = ?", [id]);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du produit:", error);
    return null;
  }
};

// Récupérer les produits par catégorie
export const getProductsByCategory = (category) => {
  try {
    const result = db.getAllSync("SELECT * FROM products WHERE category = ?", [
      category,
    ]);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération par catégorie:", error);
    return [];
  }
};

// ============ CLIENTS ============

// Ajouter un client
export const addCustomer = (firstName, lastName, phone, address) => {
  try {
    const result = db.runSync(
      "INSERT INTO customers (first_name, last_name, phone, address) VALUES (?, ?, ?, ?)",
      [firstName, lastName, phone, address]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du client:", error);
    return null;
  }
};

// Récupérer un client par téléphone
export const getCustomerByPhone = (phone) => {
  try {
    const result = db.getFirstSync("SELECT * FROM customers WHERE phone = ?", [
      phone,
    ]);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du client:", error);
    return null;
  }
};

// ============ COMMANDES ============

// Créer une commande
export const createOrder = (customerId, cart, totalAmount) => {
  try {
    let orderId = null;

    // Commencer une transaction
    db.withTransactionSync(() => {
      // Insérer la commande
      const orderResult = db.runSync(
        "INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)",
        [customerId, totalAmount, "pending"]
      );

      orderId = orderResult.lastInsertRowId;

      // Insérer les items de la commande
      const statement = db.prepareSync(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
      );

      cart.forEach((item) => {
        statement.executeSync([orderId, item.id, item.quantity, item.price]);
      });

      console.log("✅ Commande créée avec succès:", orderId);
    });

    return orderId;
  } catch (error) {
    console.error("❌ Erreur lors de la création de la commande:", error);
    return null;
  }
};

// Récupérer toutes les commandes
export const getAllOrders = () => {
  try {
    const result = db.getAllSync(`
      SELECT 
        o.*,
        c.first_name,
        c.last_name,
        c.phone,
        c.address
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des commandes:", error);
    return [];
  }
};

// Récupérer les détails d'une commande
export const getOrderDetails = (orderId) => {
  try {
    const order = db.getFirstSync(
      `
      SELECT 
        o.*,
        c.first_name,
        c.last_name,
        c.phone,
        c.address
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `,
      [orderId]
    );

    const items = db.getAllSync(
      `
      SELECT 
        oi.*,
        p.name,
        p.image,
        p.category
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `,
      [orderId]
    );

    return { ...order, items };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des détails:", error);
    return null;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = (orderId, status) => {
  try {
    db.runSync("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    console.log("✅ Statut de la commande mis à jour");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut:", error);
    return false;
  }
};

// ============ STATISTIQUES ============

// Obtenir les statistiques
export const getStats = () => {
  try {
    const totalOrders = db.getFirstSync("SELECT COUNT(*) as count FROM orders");
    const totalRevenue = db.getFirstSync(
      'SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"'
    );
    const totalCustomers = db.getFirstSync(
      "SELECT COUNT(*) as count FROM customers"
    );
    const pendingOrders = db.getFirstSync(
      'SELECT COUNT(*) as count FROM orders WHERE status = "pending"'
    );
    const completedOrders = db.getFirstSync(
      'SELECT COUNT(*) as count FROM orders WHERE status = "completed"'
    );

    return {
      totalOrders: totalOrders.count,
      totalRevenue: totalRevenue.total || 0,
      totalCustomers: totalCustomers.count,
      pendingOrders: pendingOrders.count,
      completedOrders: completedOrders.count,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stats:", error);
    return null;
  }
};

export default db;
