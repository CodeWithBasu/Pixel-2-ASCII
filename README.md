# 🌌 ASCII Studio

![ASCII Studio Hero](./public/hero.png)

**ASCII Studio** is a high-performance web application designed for digital artists and terminal enthusiasts. It transforms your images and videos into mesmerizing ASCII matrix art using real-time character-density algorithms. With built-in cloud synchronization, you can archive your transmissions and share them with the local community vault.

---

## ⚡ Key Features

- **🖼️ Image-to-ASCII Engine**: Convert high-resolution images into colored or monochrome character grids.
- **🎬 Video-to-ASCII Uplink**: Process video files frame-by-frame and export them as text-based sequences.
- **☁️ Cloud Buffer**: Archive your best renders to a MongoDB-powered community gallery.
- **🛡️ Registry Protocol**: Secure user authentication (JWT) with persistent sessions.
- **🖥️ Admin Override**: Specialized dashboard for vault management and transmission purging.
- **📱 PWA Ready**: Install as a standalone web app for a desktop-like experience.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [Framer Motion 12](https://www.framer.com/motion/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/)
- **Auth**: [JWT](https://jwt.io/) + [JOSE](https://github.com/panva/jose)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toasts**: [Sonner](https://sonner.stevenly.me/)

---

## 🚀 Getting Started

### 1. Clone the Node
```bash
git clone https://github.com/CodeWithBasu/Pixel-2-ASCII.git
cd Pixel-2-ASCII
```

### 2. Initialize Dependencies
```bash
npm install
```

### 3. Configure the Grid (.env.local)
Create a `.env.local` file in the root and configure your uplink credentials:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_random_key
ADMIN_EMAIL=your_admin_email@domain.com
```

### 4. Boot System
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to begin.

---

## 📜 Admin Protocols
To unlock the **Admin Override** console:
1. Register a new ID using the `ADMIN_EMAIL` specified in your `.env.local`.
2. Access the specialized dashboard at `/admin`.

---

## 📄 License
Created with ☕ and passion by **Basudev**. All transmissions are public under the MIT License.