import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import backgroundImage from "./assets/Background.jpeg";

const App = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;