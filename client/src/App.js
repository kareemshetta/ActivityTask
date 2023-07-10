import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import AppRouter from "./router/AppRouter";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    // <div className="App">
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    // </div>
  );
}

export default App;
