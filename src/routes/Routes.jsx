import { Suspense, lazy } from "react";
import { Route, Routes as RoutesApp } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Loading from "../pages/Loading";

const Home = lazy(() => import("../pages/Home"));
const Articles = lazy(() => import("../pages/Articles"));
const Orders = lazy(() => import("../pages/Orders"));
const ArticleDetails = lazy(() => import("../pages/ArticleDetails"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));
const NewArticle = lazy(() => import("../pages/NewArticle"));
const NewOrder = lazy(() => import("../pages/NewOrder"));
// const NotFound = lazy(() => import("../pages/NotFound"));

const Routes = () => (
  <RoutesApp>
    <Route
      path={ROUTES.home}
      element={
        <Suspense fallback={<Loading />}>
          <Home />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.articles}
      element={
        <Suspense fallback={<Loading />}>
          <Articles />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.article}
      element={
        <Suspense fallback={<Loading />}>
          <ArticleDetails />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.newArticle}
      element={
        <Suspense fallback={<Loading />}>
          <NewArticle />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.orders}
      element={
        <Suspense fallback={<Loading />}>
          <Orders />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.order}
      element={
        <Suspense fallback={<Loading />}>
          <OrderDetails />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.newOrder}
      element={
        <Suspense fallback={<Loading />}>
          <NewOrder />
        </Suspense>
      }
    />
  </RoutesApp>
);

export default Routes;
