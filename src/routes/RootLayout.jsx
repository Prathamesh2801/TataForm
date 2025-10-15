import { HashRouter, Route, Routes } from "react-router-dom";
import StartupPage from "../pages/StartupPage";
import MainFormPage from "../pages/MainFormPage";
import FinalSubmitPage from "../pages/FinalSubmitPage";
import Dashboard from "../pages/Dasgboard";

export default function RootLayout() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<StartupPage />} />
        <Route path="/form" element={<MainFormPage />} />
        <Route path="/finalSubmit" element={<FinalSubmitPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}
