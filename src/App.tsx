import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import AdminSidebar from "./components/AdminSidebar";
import AdminGlobalAnalytics from "./pages/AdminGlobalAnalytics";
import AdminUpdates from "./pages/AdminUpdates";
import AdminAffiliates from "./pages/AdminAffiliates";
import AdminChat from "./pages/AdminChat";
import AdminSettings from "./pages/AdminSettings";
import Dashboard from "./pages/Dashboard";
import Widgets from "./pages/Widgets";
import Verification from "./pages/Verification";
import Statistics from "./pages/Statistics";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import AdminAnalytics from "./pages/AdminAnalytics";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex w-full bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireRole="admin">
                  <AdminSidebar />
                  <main className="flex-1 overflow-auto">
                    <Admin />
                  </main>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/global-analytics" element={
                <ProtectedRoute requireRole="admin">
                  <AdminSidebar />
                  <main className="flex-1 overflow-auto">
                    <AdminGlobalAnalytics />
                  </main>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/updates" element={
                <ProtectedRoute requireRole="admin">
                  <AdminSidebar />
                  <main className="flex-1 overflow-auto">
                    <AdminUpdates />
                  </main>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/affiliates" element={
                <ProtectedRoute requireRole="admin">
                  <AdminSidebar />
                  <main className="flex-1 overflow-auto">
                    <AdminAffiliates />
                  </main>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/chat" element={
                <ProtectedRoute requireRole="admin">
                  <AdminSidebar />
                  <main className="flex-1 overflow-auto">
                    <AdminChat />
                  </main>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/settings" element={
                <ProtectedRoute requireRole="admin">
                  <AdminSidebar />
                  <main className="flex-1 overflow-auto">
                    <AdminSettings />
                  </main>
                </ProtectedRoute>
              } />
              
              {/* Client dashboard routes */}
              <Route path="/*" element={
                <ProtectedRoute requireRole="company">
                  <Sidebar userRole="client" />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/widgets" element={<Widgets />} />
                      <Route path="/verification" element={<Verification />} />
                      <Route path="/statistics" element={<Statistics />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
