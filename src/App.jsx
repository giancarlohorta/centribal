import { lazy } from "react";

const Routes = lazy(() => import("./routes/Routes"));

const App = () => <Routes />;

export default App;
