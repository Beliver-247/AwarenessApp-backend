# Quick Setup Guide

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your preferred platform:**
   - **iOS**: Press `i` in terminal or scan QR with Expo Go
   - **Android**: Press `a` in terminal or scan QR with Expo Go
   - **Web**: Press `w` in terminal

## 🔧 Configuration

### Backend Connection
The app is configured to connect to `http://localhost:5000/api` by default.

To change the backend URL:
1. Update `src/config/config.ts`
2. Or set environment variable: `EXPO_PUBLIC_API_URL=http://your-backend-url/api`

### Demo Mode
If you want to test without a backend, you can modify the API services to return demo data from `src/data/demoData.ts`.

## 📱 Features Available

- ✅ **Authentication**: Login/Register screens
- ✅ **Events**: Browse and join community events
- ✅ **Challenges**: Participate in challenges and earn points
- ✅ **Volunteer**: Find volunteer opportunities
- ✅ **Achievements**: Track progress and view leaderboards
- ✅ **Profile**: User profile and settings
- ✅ **Navigation**: Tab-based navigation between screens

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # App configuration
├── contexts/           # React Context providers
├── data/               # Demo data for testing
├── navigation/         # Navigation setup
├── screens/            # Screen components
├── services/           # API services
└── types/              # TypeScript definitions
```

## 🐛 Troubleshooting

- **Metro bundler issues**: `npx expo start --clear`
- **Navigation errors**: Ensure all navigation packages are installed
- **API connection**: Verify backend is running and URL is correct

## 📚 Next Steps

1. **Connect to your backend**: Update API endpoints in `src/services/api.ts`
2. **Customize UI**: Modify styles and components as needed
3. **Add features**: Extend the app with new functionality
4. **Testing**: Test on both iOS and Android devices

## 🔗 Dependencies

- React Native + Expo
- React Navigation (Stack + Tabs)
- Axios for HTTP requests
- AsyncStorage for local storage
- TypeScript for type safety

---

**Happy coding! 🎉**

