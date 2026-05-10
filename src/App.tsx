import { createBrowserRouter, Navigate } from 'react-router-dom'
import SetupPage from './pages/SetupPage'
import BingoPage from './pages/BingoPage'
import LeaderboardPage from './pages/LeaderboardPage'
import MapPage from './pages/MapPage'
import AdminPage from './pages/AdminPage'
import AppLayout from './components/layout/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SetupPage />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/bingo',       element: <BingoPage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/map',         element: <MapPage /> },
      { path: '/admin',       element: <AdminPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
