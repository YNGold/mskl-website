# MSKL.io - Where Sharp Minds Meet Real-World Challenges

A modern, fast-loading website for MSKL.io, a nationwide platform where exceptional students in 8th grade and above tackle real-world problems through bi-weekly challenges that combine math, science, and innovative problem-solving.

## 🚀 Features

### Core Functionality
- **User Authentication**: Student signup/login with parent/guardian approval
- **Challenge System**: Bi-weekly real-world challenges with points and prizes
- **Leaderboard**: Real-time ranking system with student profiles
- **Team Collaboration**: Form teams and tackle complex problems together
- **Progress Tracking**: Dashboard with stats, achievements, and activity
- **Community**: Connect with students nationwide

### Design & UX
- **Modern UI**: Sophisticated design that bridges academic excellence with real-world impact
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth transitions and interactive elements using Framer Motion
- **Fast Loading**: Optimized for performance and user experience

### Technical Stack
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom gradients and animations
- **Database**: Prisma ORM with SQLite (easily switchable to PostgreSQL)
- **Authentication**: NextAuth.js with JWT sessions
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mskl-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mskl-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages (login/signup)
│   │   ├── dashboard/         # Student dashboard
│   │   ├── admin/             # Admin panel (future)
│   │   ├── challenges/        # Challenge pages
│   │   ├── leaderboard/       # Leaderboard page
│   │   ├── prizes/            # Prizes and events
│   │   └── community/         # Community features
│   ├── components/            # Reusable React components
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── UpcomingChallenges.tsx
│   │   ├── PrizesSection.tsx
│   │   ├── LeaderboardPreview.tsx
│   │   ├── CommunitySection.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AuthProvider.tsx
│   └── lib/                   # Utility functions and configurations
│       ├── prisma.ts          # Prisma client
│       └── auth.ts            # NextAuth configuration
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6) to Pink (#EC4899) gradients
- **Background**: Dark slate (#0F172A) with purple/pink accents
- **Text**: White and gray variations for hierarchy
- **Accents**: Green, blue, yellow, and orange for different features

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Sizes**: Responsive scale from 12px to 72px

### Components
- **Cards**: Glassmorphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Dark theme with purple accents
- **Navigation**: Sticky header with mobile menu

## 🔧 Configuration

### Database
The project uses Prisma with SQLite by default. To switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update your `.env` file with PostgreSQL connection string

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Authentication
NextAuth.js is configured with credentials provider. To add social logins:

1. Add providers to `src/lib/auth.ts`
2. Configure OAuth credentials in `.env`
3. Update the UI to include social login buttons

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Database Schema

### Core Models
- **User**: Student profiles with authentication
- **Challenge**: STEM challenges with metadata
- **Submission**: Student solutions and scores
- **Team**: Collaborative groups
- **Prize**: Available rewards
- **Event**: Exclusive events and workshops

### Relationships
- Users can join multiple teams
- Challenges have multiple submissions
- Teams can work on challenges together
- Users earn points through submissions

## 🔮 Future Features

### Planned Enhancements
- **Admin Dashboard**: Manage challenges, users, and content
- **Real-time Chat**: Team communication during challenges
- **Video Tutorials**: Learning resources for students
- **Mobile App**: Native iOS/Android applications
- **API Integration**: Connect with educational platforms
- **Analytics**: Detailed performance tracking
- **Gamification**: Badges, achievements, and rewards

### Scalability Considerations
- **Database**: PostgreSQL for production scale
- **Caching**: Redis for session and data caching
- **CDN**: Static asset optimization
- **Monitoring**: Error tracking and performance monitoring
- **Security**: Rate limiting and input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@mskl.io
- Documentation: [docs.mskl.io](https://docs.mskl.io)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- Framer Motion for smooth animations
- Lucide for beautiful icons
- Prisma for the excellent ORM

---

**MSKL.io** - Empowering the next generation of STEM leaders through competitive challenges and collaborative learning.
