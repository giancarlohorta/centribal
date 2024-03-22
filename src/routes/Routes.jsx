import { Suspense, lazy } from "react";
import { Route, Routes as RoutesApp } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Loading from "../pages/Loading";

const Home = lazy(() => import("../pages/Home"));
const Articles = lazy(() => import("../pages/Articles"));
const ArticleDetails = lazy(() => import("../pages/ArticleDetails"));
const NewArticle = lazy(() => import("../pages/NewArticle"));
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
  </RoutesApp>
);

export default Routes;
