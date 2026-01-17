// Ouvrir la base de données
let db = null;
let SQLite = null;

// Vérifier si on est sur une plateforme native
const isNative =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

if (isNative) {
  try {
    SQLite = require("expo-sqlite");
    db = SQLite.openDatabaseSync("agree.db");
  } catch (error) {
    console.warn("⚠️ Erreur lors de l'ouverture de la base de données:", error);
  }
}

// ============ DONNÉES MOCK POUR WEB ============
let mockOrders = [];
let mockCustomers = [];
let mockOrderItems = [];
let mockOrderIdCounter = 1;
let mockCustomerIdCounter = 1;
let mockDataInitialized = false;

// Initialiser les données mock pour le web
const initMockData = () => {
  if (mockDataInitialized) {
    return; // Déjà initialisé, ne rien faire
  }
  
  console.log("🌐 Initialisation des données mock pour web...");
  mockDataInitialized = true;

  // Clients mock
  mockCustomers = [
    {
      id: 1,
      first_name: "Mohammed",
      last_name: "Alami",
      phone: "0612345678",
      address: "12 Rue Hassan II, Casablanca",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 2,
      first_name: "Fatima",
      last_name: "Benali",
      phone: "0623456789",
      address: "45 Avenue Mohammed V, Rabat",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  mockCustomerIdCounter = 3;

    // Commandes mock
    mockOrders = [
      {
        id: 1,
        customer_id: 1,
        total_amount: 35.97,
        status: "pending",
        created_at: new Date().toISOString(),
        first_name: "Mohammed",
        last_name: "Alami",
        phone: "0612345678",
        address: "12 Rue Hassan II, Casablanca",
      },
      {
        id: 2,
        customer_id: 2,
        total_amount: 28.97,
        status: "completed",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        first_name: "Fatima",
        last_name: "Benali",
        phone: "0623456789",
        address: "45 Avenue Mohammed V, Rabat",
      },
    ];
    mockOrderIdCounter = 3;

    // Items de commandes mock
    mockOrderItems = [
      {
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 2,
        price: 8.99,
        name: "Fresh Salad",
        image: "🥗",
        category: "Salads",
      },
      {
        id: 2,
        order_id: 1,
        product_id: 2,
        quantity: 1,
        price: 6.99,
        name: "Green Smoothie",
        image: "🥤",
        category: "Drinks",
      },
      {
        id: 3,
        order_id: 2,
        product_id: 3,
        quantity: 1,
        price: 9.99,
        name: "Avocado Toast",
        image: "🥑",
        category: "Breakfast",
      },
      {
        id: 4,
        order_id: 2,
        product_id: 4,
        quantity: 2,
        price: 12.99,
        name: "Veggie Bowl",
        image: "🥙",
        category: "Bowls",
      },
    ];

    console.log(
      "✅ Données mock initialisées:",
      mockOrders.length,
      "commandes",
    );
  }
};

// Initialiser la base de données
export const initDatabase = () => {
  if (!db) {
    console.log("⚠️ SQLite non disponible");
    return;
  }

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
  if (!db) return null;

  try {
    const result = db.runSync(
      "INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)",
      [name, price, image, category, description],
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
  if (!db) {
    console.log("⚠️ Seed data non disponible");
    return;
  }

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
        "INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)",
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

// Créer des données de test pour les commandes
export const seedTestOrders = () => {
  if (!db) {
    console.log("⚠️ Base de données non disponible pour seed orders");
    return;
  }

  try {
    const orderCount = db.getFirstSync("SELECT COUNT(*) as count FROM orders");

    console.log("📊 Nombre de commandes actuelles:", orderCount.count);

    if (orderCount.count === 0) {
      console.log("📦 Création de commandes de test...");

      // Créer des clients de test
      const customer1 = db.runSync(
        "INSERT INTO customers (first_name, last_name, phone, address) VALUES (?, ?, ?, ?)",
        ["Mohammed", "Alami", "0612345678", "12 Rue Hassan II, Casablanca"],
      );

      console.log("✅ Client 1 créé, ID:", customer1.lastInsertRowId);

      const customer2 = db.runSync(
        "INSERT INTO customers (first_name, last_name, phone, address) VALUES (?, ?, ?, ?)",
        ["Fatima", "Benali", "0623456789", "45 Avenue Mohammed V, Rabat"],
      );

      console.log("✅ Client 2 créé, ID:", customer2.lastInsertRowId);

      // Récupérer quelques produits
      const products = db.getAllSync("SELECT * FROM products LIMIT 5");
      console.log("🥗 Produits disponibles:", products.length);

      if (products.length > 0) {
        // Commande 1
        const order1 = db.runSync(
          "INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)",
          [customer1.lastInsertRowId, 35.97, "pending"],
        );

        console.log("✅ Commande 1 créée, ID:", order1.lastInsertRowId);

        // Items de la commande 1
        db.runSync(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [order1.lastInsertRowId, products[0].id, 2, products[0].price],
        );
        db.runSync(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [order1.lastInsertRowId, products[1].id, 1, products[1].price],
        );

        console.log("✅ Articles ajoutés à la commande 1");

        // Commande 2
        const order2 = db.runSync(
          "INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)",
          [customer2.lastInsertRowId, 28.97, "completed"],
        );

        console.log("✅ Commande 2 créée, ID:", order2.lastInsertRowId);

        // Items de la commande 2
        db.runSync(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [order2.lastInsertRowId, products[2].id, 1, products[2].price],
        );
        db.runSync(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [order2.lastInsertRowId, products[3].id, 2, products[3].price],
        );

        console.log("✅ Articles ajoutés à la commande 2");
        console.log("✅ Commandes de test créées avec succès");
      } else {
        console.log("⚠️ Aucun produit disponible pour créer des commandes");
      }
    } else {
      console.log(
        "ℹ️ Des commandes existent déjà (" + orderCount.count + "), skip seed",
      );
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création des commandes de test:",
      error,
    );
  }
};

// Récupérer tous les produits
export const getAllProducts = () => {
  if (!db) return [];

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
  if (!db) return null;

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
  if (!db) return [];

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
  if (!db) {
    initMockData();
    console.log("📝 Avant ajout - mockCustomers.length:", mockCustomers.length);
    console.log("🌐 Ajout client mock:", firstName, lastName);

    const newCustomer = {
      id: mockCustomerIdCounter++,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address: address,
      created_at: new Date().toISOString(),
    };
    mockCustomers.push(newCustomer);
    console.log("✅ Client mock créé avec ID:", newCustomer.id);
    console.log("📊 Après ajout - mockCustomers.length:", mockCustomers.length);
    console.log("📋 Liste des téléphones:", mockCustomers.map(c => c.phone));
    return newCustomer.id;
  }

  try {
    const result = db.runSync(
      "INSERT INTO customers (first_name, last_name, phone, address) VALUES (?, ?, ?, ?)",
      [firstName, lastName, phone, address],
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du client:", error);
    return null;
  }
};

// Récupérer un client par téléphone
export const getCustomerByPhone = (phone) => {
  if (!db) {
    initMockData();
    console.log("🔍 Recherche client mock par téléphone:", phone);
    return mockCustomers.find((c) => c.phone === phone) || null;
  }

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

// Récupérer tous les clients
export const getAllCustomers = () => {
  if (!db) {
    initMockData();
    console.log("� getAllCustomers - Retour de", mockCustomers.length, "clients");
    console.log("📋 Noms des clients:", mockCustomers.map(c => `${c.first_name} ${c.last_name}`));
    console.log("📋 Téléphones:", mockCustomers.map(c => c.phone));
    return mockCustomers;
  }

  try {
    const result = db.getAllSync(
      "SELECT * FROM customers ORDER BY created_at DESC",
    );
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des clients:", error);
    return [];
  }
};

// Mettre à jour un client
export const updateCustomer = (id, firstName, lastName, phone, address) => {
  try {
    db.runSync(
      "UPDATE customers SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?",
      [firstName, lastName, phone, address, id],
    );
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du client:", error);
    return false;
  }
};

// Supprimer un client
export const deleteCustomer = (id) => {
  try {
    db.runSync("DELETE FROM customers WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du client:", error);
    return false;
  }
};

// ============ COMMANDES ============

// Créer une commande
export const createOrder = (customerId, cart, totalAmount) => {
  if (!db) {
    initMockData();
    console.log("🌐 Création commande mock pour client:", customerId);

    // Trouver le client
    const customer = mockCustomers.find((c) => c.id === customerId);
    if (!customer) {
      console.log("⚠️ Client mock non trouvé");
      return null;
    }

    // Créer la commande
    const orderId = mockOrderIdCounter++;
    const newOrder = {
      id: orderId,
      customer_id: customerId,
      total_amount: totalAmount,
      status: "pending",
      created_at: new Date().toISOString(),
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      address: customer.address,
    };
    mockOrders.unshift(newOrder);

    // Ajouter les items
    cart.forEach((item) => {
      mockOrderItems.push({
        id: mockOrderItems.length + 1,
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        category: item.category || "Other",
      });
    });

    console.log("✅ Commande mock créée:", orderId);
    return orderId;
  }

  try {
    let orderId = null;

    // Commencer une transaction
    db.withTransactionSync(() => {
      // Insérer la commande
      const orderResult = db.runSync(
        "INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)",
        [customerId, totalAmount, "pending"],
      );

      orderId = orderResult.lastInsertRowId;

      // Insérer les items de la commande
      const statement = db.prepareSync(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
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
  if (!db) {
    initMockData();
    console.log("📦 Retour des commandes mock:", mockOrders.length);
    return mockOrders;
  }

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

// Récupérer les commandes d'un client
export const getOrdersByPhone = (phone) => {
  if (!db) {
    initMockData();
    console.log("🔍 Recherche commandes mock pour téléphone:", phone);
    const userOrders = mockOrders.filter((order) => order.phone === phone);
    console.log("📦 Commandes trouvées:", userOrders.length);
    return userOrders;
  }

  try {
    const result = db.getAllSync(
      `
      SELECT 
        o.*,
        c.first_name,
        c.last_name,
        c.phone,
        c.address
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE c.phone = ?
      ORDER BY o.created_at DESC
    `,
      [phone],
    );
    return result;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des commandes du client:",
      error,
    );
    return [];
  }
};

// Récupérer les détails d'une commande
export const getOrderDetails = (orderId) => {
  if (!db) {
    initMockData();
    console.log("🔍 Recherche détails commande mock #" + orderId);

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) {
      console.log("⚠️ Commande mock non trouvée:", orderId);
      return null;
    }

    const items = mockOrderItems.filter((item) => item.order_id === orderId);
    console.log(
      "✅ Détails commande mock #" + orderId + ":",
      items.length,
      "articles",
    );

    return { ...order, items };
  }

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
      [orderId],
    );

    if (!order) {
      console.log("⚠️ Commande non trouvée:", orderId);
      return null;
    }

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
      [orderId],
    );

    console.log(
      "✅ Détails commande #" + orderId + ":",
      items?.length + " articles",
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
      'SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"',
    );
    const totalCustomers = db.getFirstSync(
      "SELECT COUNT(*) as count FROM customers",
    );
    const pendingOrders = db.getFirstSync(
      'SELECT COUNT(*) as count FROM orders WHERE status = "pending"',
    );
    const completedOrders = db.getFirstSync(
      'SELECT COUNT(*) as count FROM orders WHERE status = "completed"',
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
