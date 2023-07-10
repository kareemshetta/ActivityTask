import React from "react";
import { Routes, Route } from "react-router-dom";
const Practice = React.lazy(() => import("../pages/practice/Practice"));
const Rank = React.lazy(() => import("../pages/rank/Rank"));
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/practice" element={<Practice></Practice>} />
      <Route path="/" element={<Practice></Practice>} />
      <Route path="/rank" element={<Rank></Rank>} />
    </Routes>
  );
}
