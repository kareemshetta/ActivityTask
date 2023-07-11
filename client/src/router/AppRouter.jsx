import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "react-bootstrap/esm/Spinner";
const Practice = React.lazy(() => import("../pages/practice/Practice"));
const Rank = React.lazy(() => import("../pages/rank/Rank"));

const LoadingComponent = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center mx-auto "
      style={{ width: "50px", height: "50px" }}
    >
      <Spinner animation="border" variant="info" />
    </div>
  );
};
export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/practice"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <Practice />
          </Suspense>
        }
      />
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <Practice />
          </Suspense>
        }
      />
      <Route
        path="/rank"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <Rank />
          </Suspense>
        }
      />
    </Routes>
  );
}
