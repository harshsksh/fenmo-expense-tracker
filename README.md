# 💸 Fenmo Expense Tracker

**Track every rupee with precision. Experience financial clarity.**

Fenmo is a premium, high-performance expense tracking platform designed for users who value both aesthetics and deep financial insights. Built with a "Quiet Luxury" design philosophy, it removes the noise and gives you total command over your financial outcomes.

---

## ✨ Features

- **🛡️ Secure Authentication**: Seamless Google Login via Auth.js (NextAuth v5).
- **📝 Effortless Tracking**: Quick-add expenses with category-based organization.
- **🔍 Smart Filtering**: Instant search and date-range filters to find exactly what you're looking for.
- **📈 Advanced Insights**: Beautifully animated charts showing spending trends and category breakdowns.
- **🎯 Budget Management**: Set monthly limits per category and track your progress in real-time.
- **📥 The Vault**: Export your data into clean CSV spreadsheets or professional PDF reports.
- **🌓 Dynamic Themes**: Premium Dark and Light mode support for a comfortable experience at any time.

---

## 🚀 Tech Stack

### Frontend & Framework
- **[Next.js 15+](https://nextjs.org/)**: React framework with App Router for performance and SEO.
- **[Tailwind CSS](https://tailwindcss.com/)**: Modern styling with a custom design system.
- **[Recharts](https://recharts.org/)**: Responsive and interactive data visualizations.
- **Material Symbols**: Clean, consistent iconography.

### Backend & Persistence
- **[PostgreSQL](https://www.postgresql.org/)**: Hosted on **Neon** for serverless scalability.
- **[Prisma ORM](https://www.prisma.io/)**: Type-safe database client and schema management.
- **[Auth.js](https://authjs.dev/)**: Secure, JWT-based authentication strategy.

### Export Tools
- **[@react-pdf/renderer](https://react-pdf.org/)**: For generating high-quality dynamic PDF reports.
- **[json2csv](https://github.com/juanquindoza/json2csv)**: For Excel-compatible data exports.

---

## 🎨 Visual Preview

### Landing Page
*A sleek, modern entrance that emphasizes clarity and security.*

### Rich Insights
*Visualize your spending habits with category-wise doughnut charts and daily activity bars.*

### Data Vault
*Your data, your way. Export for tax purposes or personal records with ease.*

---

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fenmo-expense-tracker.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with the following:
   ```env
   DATABASE_URL="your-postgresql-url"
   AUTH_SECRET="your-secret"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   ```

4. **Sync Database**
   ```bash
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 🛡️ Privacy & Security
Fenmo uses **JWT (JSON Web Tokens)** to ensure that your financial data is only accessible to you. All sensitive operations verify ownership at the database level to prevent unauthorized access.

---

Built by Harsh
