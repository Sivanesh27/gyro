import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Simulator from "./pages/Simulator";

export default function App() {
  return (
    <div className="App" data-testid="app-root">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/simulator" element={<Simulator />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
