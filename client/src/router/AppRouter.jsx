import React from "react";
import { Routes, Route } from "react-router-dom";
import Rank from "../pages/rank/Rank";
import Practice from "../pages/practice/Practice";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/practice" element={<Practice></Practice>} />
      <Route path="/" element={<Practice></Practice>} />
      <Route path="/rank" element={<Rank></Rank>} />
    </Routes>
  );
}
