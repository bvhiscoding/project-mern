import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>}></Route>
          <Route path="/register" element={<div>Register Page</div>}></Route>
          <Route element={<PrivateRoute/>}>
            <Route element={<Layout/>}>
              <Route path="/" element={<div>Home Page</div>}></Route>
              <Route path="/profile/:id" element={<div>Profile Page</div>}></Route>
            </Route>
          </Route>
          <Route path="*" element={<div>404 NOT FOUND PAGE</div>}></Route>
        </Routes>
      </Router>

    </Provider>
  );
}

export default App;
