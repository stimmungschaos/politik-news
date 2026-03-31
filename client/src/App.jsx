import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import StatsPage from "./pages/StatsPage";
import StoryClustersPage from "./pages/StoryClustersPage";
import BookmarksPage from "./pages/BookmarksPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kategorie/:name" element={<CategoryPage />} />
          <Route path="/suche" element={<SearchPage />} />
          <Route path="/dashboard" element={<StatsPage />} />
          <Route path="/stories" element={<StoryClustersPage />} />
          <Route path="/lesezeichen" element={<BookmarksPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
