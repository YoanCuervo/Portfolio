import { HashRouter, Navigate, Route, Routes } from "react-router";
import Navbar from "./components/layout/Navbar";
import SkipLink from "./components/layout/SkipLink";
import TabBar from "./components/layout/TabBar";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <SkipLink />
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <TabBar />
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
