# Tushar Insights - Blog Application

A modern, full-stack blog application built with Next.js 15, Strapi CMS, and TypeScript. Features a beautiful UI, multi-language support, real-time interactions, and comprehensive content management.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Features

### V1 (Current Release)
- ✅ **Multi-language Support** - English & Bengali (বাংলা)
- ✅ **Rich Text** - Markdown support with image uploads
- ✅ **Authentication** - Google OAuth integration
- ✅ **Comments System** - Nested replies with role-based permissions
- ✅ **Reactions** - Like, Love, Haha, Sad, Angry
- ✅ **User Roles** - User & Author with different permissions
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Dark Mode** - System-based theme switching
- ✅ **Category Filtering** - Browse blogs by categories
- ✅ **Search Functionality** - Real-time blog search
- ✅ **Pagination** - Efficient content loading
- ✅ **SEO Optimized** - Meta tags and structured data

### V2 (Upcoming)
- 🔄 Real-time Notifications
- 🔄 WebSocket Integration
- 🔄 Live Comment Updates
- 🔄 Push Notifications

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Redux Toolkit
- **Markdown:** ReactMarkdown, remark-gfm, rehype-raw
- **Date Formatting:** date-fns
- **Notifications:** Sonner

### Backend (CMS)
- **CMS:** Strapi 5
- **Database:** SQLite (development) / PostgreSQL (production)
- **Authentication:** JWT
- **File Upload:** Local storage / Cloud storage

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/asynctushar/tushar-insights.git
cd tushar-insights
```

### 2. Backend Setup (Strapi CMS)

```bash
cd cms
npm install
```

#### Environment Variables

Create a `.env` file in the `cms` directory:

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets (IMPORTANT: Generate new keys for production)
APP_KEYS=YOUR_APP_KEYS_HERE
API_TOKEN_SALT=YOUR_API_TOKEN_SALT_HERE
ADMIN_JWT_SECRET=YOUR_ADMIN_JWT_SECRET_HERE
TRANSFER_TOKEN_SALT=YOUR_TRANSFER_TOKEN_SALT_HERE
ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY_HERE
JWT_SECRET=YOUR_JWT_SECRET_HERE

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

**⚠️ Security Warning:** The keys shown in the example are for development only. Generate new keys for production using:

```bash
# Run this inside cms directory
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

#### Import Strapi Configuration

The repository includes pre-configured content types. After setting up:

1. Start Strapi:
```bash
npm run develop
```

2. Create admin account at `http://localhost:1337/admin`

3. The following content types are already configured:
   - **Blog** - Main blog posts
   - **Category** - Blog categories
   - **Comment** - Comments and replies
   - **Reaction** - Blog reactions
   - **Policy** - Privacy policies
   - **Term** - Terms & conditions
   - **About** - About page content
   - **User** - Extended user profiles

4. **Important:** Configure API permissions:
   - Go to Settings → Users & Permissions Plugin → Roles
   - For **Public** role: Enable search, findBySlug, find/findOne for blogs and find/findOne for categories, policies, terms, about.
   - For **Authenticated** role: Enable createComment, deleteComment, reactBlog, updateBlogReaction, deleteBlogReaction, for blogs.
   - For **Author** role: Enable reply, delete for comments.
**Note:** 
   - **Authenticated** role should have all other permissions of **Public** role.
   - **Author** role should have all other permissions of **Public** and **Authenticated** role.

### 3. Frontend Setup (Next.js)

```bash
cd ../client
npm install
```

#### Environment Variables

Create a `.env.local` file in the `client` directory:

```env
# Strapi API URL
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# For production, use your deployed Strapi URL:
# NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-domain.com
```

### 4. Run the Application

**Development Mode:**

```bash
# Terminal 1 - Run Strapi CMS
cd cms
npm run develop

# Terminal 2 - Run Next.js Client
cd client
npm run dev
```

**Access the application:**
- Frontend: `http://localhost:3000`
- Strapi Admin: `http://localhost:1337/admin`

## 📁 Project Structure

```
tushar-insights/
├── cms/                          # Strapi CMS Backend
│   ├── config/                   # Strapi configuration
│   ├── src/
│   │   ├── api/                  # API routes and controllers
│   │   ├── extensions/           # Custom extensions
│   │   └── index.js             # Entry point
│   └── .env                      # Environment variables
│
├── client/                       # Next.js Frontend
│   ├── src/
│   │   ├── app/                  # App router pages
│   │   │   ├── blogs/           # Blog pages
│   │   │   ├── about/           # About page
│   │   │   ├── api/             # API routes
│   │   │   ├── error.tsx        # Error boundary
│   │   │   ├── loading.tsx      # Loading state
│   │   │   ├── not-found.tsx    # 404 page
│   │   │   ├── page.tsx         # Home page
│   │   │   └── layout.tsx       # Root layout
│   │   ├── components/          # React components
│   │   │   ├── blog/            # Blog components
│   │   │   ├── comment/         # Comment components
│   │   │   ├── layout/          # Layout components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   └── providers/       # Context providers
│   │   ├── lib/                 # Utilities
│   │   ├── redux/               # Redux store
│   │   ├── services/            # API services
│   │   └── types/               # TypeScript types
│   └── .env.local               # Environment variables
│
└── README.md                     # This file
```

## 🎨 Key Features Explained

### Authentication Flow
1. User clicks "Login with Google"
2. OAuth flow redirects to Google
3. After successful auth, JWT token is stored in cookies
4. Token is used for authenticated API requests

### Comment System
- **Normal users:** Can comment and delete their own comments
- **Authors:** Can reply to comments, delete any comment, ban/unban users

### Reactions
- Users can react to blogs with 5 emotion types
- One reaction per user per blog
- Click same reaction to remove it
- Change reaction by clicking different emotion

### Multi-language
- Content is available in English and Bengali
- Language switcher in header
- URL parameter: `?lang=bn` for Bengali

## 🤝 Contributing to V2

We welcome contributions! Here's how you can help with V2 development:

### Branch Structure
- `main` - Stable production branch
- `v1` - V1 release branch (current)
- `v2` - Development branch for V2 features

### How to Contribute

1. **Fork the repository**

2. **Clone your fork**
```bash
git clone https://github.com/your-username/tushar-insights.git
cd tushar-insights
```

3. **Create a feature branch from v2**
```bash
git checkout v2
git pull origin v2
git checkout -b feature/your-feature-name
```

4. **Make your changes**
   - Follow existing code style
   - Write meaningful commit messages
   - Add comments for complex logic

5. **Test your changes**
```bash
npm run build
npm run start
```

6. **Commit and push**
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

7. **Create a Pull Request**
   - Base branch: `v2`
   - Describe your changes clearly
   - Reference any related issues

### V2 Development Priorities

1. **Real-time Notifications**
   - WebSocket integration
   - Notification bell with count
   - Mark as read functionality

2. **Live Updates**
   - Real-time comment updates
   - Live reaction counts
   - Online user indicators

3. **Performance**
   - Optimize image loading
   - Implement infinite scroll
   - Cache improvements

### Code Style Guidelines

- Use TypeScript for type safety
- Follow Prettier formatting
- Use meaningful variable names
- Write descriptive comments
- Keep components small and focused
- Use custom hooks for reusable logic

## 🐛 Known Issues

- [ ] Search suggestions need optimization
- [ ] Mobile menu needs smoother animation
- [ ] Image optimization for better performance

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Tushar Biswas**
- Website: [tushar-insights.vercel.app](https://tushar-insights.vercel.app)
- GitHub: [@asynctushar](https://github.com/asynctushar)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Strapi](https://strapi.io/) - Headless CMS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

For support, email contact@tusharinsights.com or open an issue on GitHub.

---

**⭐ If you find this project useful, please give it a star!**