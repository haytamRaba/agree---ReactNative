# 🌿 Agree - Healthy Vegetarian Food Delivery App

## 📚 School Project

A React Native mobile application developed as a school project. The app provides a modern and intuitive platform for ordering healthy vegetarian meals with real-time order management and admin panel.

---

## 📸 App Screenshots

### 🛍️ Client Side
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="./assets/acceuile.jpeg" alt="Home Screen" width="250" />
        <p><b>🏠 Home Screen</b></p>
      </td>
      <td align="center">
        <img src="./assets/panoer-client.jpeg" alt="Shopping Cart" width="250" />
        <p><b>🛒 Shopping Cart</b></p>
      </td>
      <td align="center">
        <img src="./assets/profile client.jpeg" alt="User Profile" width="250" />
        <p><b>👤 User Profile</b></p>
      </td>
      <td align="center">
        <img src="./assets/splash.png" alt="Splash Screen" width="250" />
        <p><b>✨ Splash Screen</b></p>
      </td>
    </tr>
  </table>
</div>

### 📊 Admin Panel
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="./assets/stats-admin.jpeg" alt="Statistics Dashboard" width="250" />
        <p><b>📈 Statistics Dashboard</b></p>
      </td>
      <td align="center">
        <img src="./assets/commande-admin.jpeg" alt="Order Management" width="250" />
        <p><b>📦 Order Management</b></p>
      </td>
      <td align="center">
        <img src="./assets/produit-admin.jpeg" alt="Product Management" width="250" />
        <p><b>🥗 Product Management</b></p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="./assets/user-admin.jpeg" alt="User Management" width="250" />
        <p><b>👥 User Management</b></p>
      </td>
      <td align="center">
        <img src="./assets/orders-admin.jpeg" alt="Orders Overview" width="250" />
        <p><b>📋 Orders Overview</b></p>
      </td>
      <td align="center">
        <img src="./assets/splash.png" alt="Splash Screen" width="250" />
        <p><b>✨ Splash Screen</b></p>
      </td>
    </tr>
  </table>
</div>

---

## 📋 Project Overview

**Agree** is a user-friendly food delivery application that specializes in vegetarian cuisine. The app allows users to browse products by categories, add items to their cart, and proceed to checkout with a simple and intuitive interface.

### Key Features

#### 🛍️ Client Features
- ✅ Browse healthy vegetarian food products
- ✅ Category-based product filtering
- ✅ Shopping cart management with real-time updates
- ✅ User profile and account management
- ✅ Checkout with customer information form
- ✅ Order history and tracking
- ✅ Custom alerts and notifications
- ✅ Responsive design optimized for mobile and web

#### 👨‍💼 Admin Features
- ✅ Real-time statistics dashboard
- ✅ Complete order management system
- ✅ Product inventory management
- ✅ User management panel
- ✅ Sales analytics and reports
- ✅ SQLite database integration
- ✅ Secure admin authentication

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: JavaScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Context API
- **Storage**: AsyncStorage for user persistence
- **UI Components**: Custom alert system with modal designs

---

## 📁 Project Structure

```
agree---ReactNative/
├── src/
│   ├── screens/
│   │   ├── SplashScreen.js       # Animated splash screen
│   │   ├── HomeScreen.js         # Main product listing and categories
│   │   ├── CheckoutScreen.js     # Order checkout and customer info
│   │   ├── ProfileScreen.js      # User profile management
│   │   ├── OrdersScreen.js       # Order history and tracking
│   │   ├── AdminScreen.js        # Admin dashboard and management
│   │   └── AdminLoginScreen.js   # Secure admin authentication
│   ├── components/
│   │   └── CustomAlert.js        # Custom modal alert system
│   ├── context/
│   │   ├── CartContext.js        # Shopping cart state management
│   │   └── UserContext.js        # User authentication and data
│   ├── services/
│   │   └── database.js           # SQLite database operations
│   ├── constants/
│   │   └── colors.js             # App color theme
│   └── data/
│       └── productsData.js       # Product database
├── assets/                        # Images and screenshots
├── App.js                         # Main app component with navigation
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
└── README.md                      # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Expo CLI (optional)

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   git clone https://github.com/haytamRaba/agree---ReactNative.git
   cd reactNat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the App

#### Web Version

```bash
npm run web
```

#### Android

```bash
npm run android
```

#### iOS

```bash
npm run ios
```

---

## 🎨 Design & Features

### Color Theme

The app uses a healthy, natural color palette featuring:

- Fresh greens for primary actions
- Neutral backgrounds for clarity
- High contrast for readability

### Navigation Flow

1. **Splash Screen** - Animated introduction with app branding
2. **Home Screen** - Browse products and categories
3. **Cart** - Review selected items
4. **Checkout** - Enter customer information and complete order

---

## 📱 User Interface

- **HomeScreen**: Displays popular products and categories for easy navigation
- **CheckoutScreen**: Collects customer details (name, address, phone, email)
- **Cart Functionality**: Add/remove items and view total price

---

## 💻 Development Notes

- The app is built using Expo, which allows for quick development and testing across platforms
- Navigation is managed with React Navigation for smooth screen transitions
- Product data is stored locally in `productsData.js` for easy modification

---

## 🔄 Future Enhancements

- Integration with backend API for real-time product updates
- User authentication and account management
- Payment gateway integration
- Order tracking system
- User reviews and ratings
- Wishlist functionality

---

## 👨‍💼 Authors

School Project - **Haytam Raba** & **Wassim Lazim** - G9

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

Created for educational purposes as a school project.
