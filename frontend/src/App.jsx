import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p className="text-4xl text-red-600">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
