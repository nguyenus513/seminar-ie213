import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import OverviewPage from "./pages/OverviewPage";
import DatasetPage from "./pages/DatasetPage";
import IndexManagementPage from "./pages/IndexManagementPage";
import BenchmarkPage from "./pages/BenchmarkPage";
import ComparePage from "./pages/ComparePage";
import StrategyComparisonPage from "./pages/StrategyComparisonPage";
import AIIndexAdvisorPage from "./pages/AIIndexAdvisorPage";
import ExplainPlanPage from "./pages/ExplainPlanPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/dataset" element={<DatasetPage />} />
        <Route path="/indexes" element={<IndexManagementPage />} />
        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/strategy-comparison" element={<StrategyComparisonPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/ai-index-advisor" element={<AIIndexAdvisorPage />} />
        <Route path="/explain/:queryKey" element={<ExplainPlanPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </DashboardLayout>
  );
}
