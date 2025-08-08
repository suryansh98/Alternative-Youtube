# Alternative YouTube

A minimalistic YouTube clone built with React, TypeScript, Node.js, and Express. This application provides a clean, distraction-free way to browse and watch YouTube content using the YouTube Data API v3.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with your Google account
- 📺 **Latest Videos Feed** - View latest videos from your subscribed channels
- 📋 **Subscriptions Management** - Browse your YouTube subscriptions
- 🎥 **Video Playback** - Watch videos with ReactPlayer integration
- 🎨 **Minimalistic UI** - Clean, retro-styled interface using custom UI components
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **ReactPlayer** for video playback
- **Custom Retro UI Components**

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Passport.js** with Google OAuth 2.0
- **YouTube Data API v3**
- **Session-based authentication**
- **CORS enabled** for cross-origin requests

## Project Structure

```
Alternative-Youtube/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── retroui/
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── googleStrategy.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── youtubeRoutes.ts
│   │   ├── services/
│   │   │   └── youtubeService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Console project with YouTube Data API v3 enabled
- Google OAuth 2.0 credentials

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/suryansh98/Alternative-Youtube.git
   cd Alternative-Youtube
   ```

2. **Setup Google OAuth Credentials**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/auth/google/callback`

3. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in backend directory:

   ```env
   PORT=3000
   NODE_ENV=development
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   SESSION_SECRET=your_long_random_secret_key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   Server will run on `http://localhost:3000`

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

3. **Access the application**
   Open `http://localhost:5173` in your browser

## API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Handle OAuth callback
- `GET /auth/status` - Check authentication status
- `GET /auth/logout` - Logout user

### YouTube Data

- `GET /api/youtube/channel` - Get user's channel information
- `GET /api/youtube/subscriptions` - Get user's subscriptions
- `GET /api/youtube/latest-videos` - Get latest videos from subscribed channels
- `GET /api/youtube/playlists` - Get user's playlists
- `GET /api/youtube/liked-videos` - Get user's liked videos
- `GET /api/youtube/search` - Search for videos
- `GET /api/youtube/video/:videoId` - Get specific video details

## Features in Detail

### Authentication Flow

1. User clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. After authorization, redirected back to application
4. Session created and user can access YouTube data

### Video Feed

- Displays latest videos from user's subscribed channels
- Shows video thumbnails, titles, and channel information
- Click-to-play video functionality with ReactPlayer
- Responsive grid layout

### Navigation

- Clean navbar with tab-based navigation
- Home, Subscriptions, Liked Videos, and Playlists sections
- Logout functionality

## Development

### Available Scripts

**Backend:**

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run clean` - Remove build directory

**Frontend:**

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

| Variable               | Description                   | Required                            |
| ---------------------- | ----------------------------- | ----------------------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID        | Yes                                 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret    | Yes                                 |
| `SESSION_SECRET`       | Secret for session encryption | Yes                                 |
| `PORT`                 | Backend server port           | No (default: 3000)                  |
| `NODE_ENV`             | Environment mode              | No (default: development)           |
| `FRONTEND_URL`         | Frontend URL for CORS         | No (default: http://localhost:5173) |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- YouTube Data API v3 for providing video data
- Google OAuth for secure authentication
- React and Node.js communities for excellent documentation
- All contributors who helped improve this project

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**

   - Ensure backend server is running on port 3000
   - Check CORS configuration
   - Verify environment variables

2. **Authentication not working**

   - Check Google OAuth credentials
   - Verify redirect URI in Google Console
   - Ensure session secret is set

3. **Videos not loading**
   - Verify YouTube Data API is enabled
   - Check API quotas and limits
   - Ensure proper video ID format

### Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed description

---

Made with ❤️ by [Suryansh](https://github.com/suryansh98)
