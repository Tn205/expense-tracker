import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"
import "./theme.css"
import { Navbar } from "./components/layouts/Navbar";
import { Home } from "./components/common/Home";
import { Login } from "./components/common/Login";
import { Register } from "./components/common/Register";
import { TestForm } from "./components/common/TestForm";
import { Reports } from "./components/user/Reports";
import { Dashboard } from "./components/user/Dashboard";
import { Profile } from "./components/user/Profile";
import { ExpenseForm } from "./components/user/ExpenseForm";
import { ExpenseList } from "./components/user/ExpenseList";
import axios from "axios";
import { PrivateRoutes } from "./components/hooks/PrivateRoutes";
import { Bounce, ToastContainer } from "react-toastify";
import {BudgetForm} from "./components/user/BudgetForm";
import { AddSampleData } from "./components/admin/AddSampleData";

function App() {

  axios.defaults.baseURL = "http://localhost:8000"; // Set the base URL for all requestsa
  return (
    <div className="main">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        className={"toast-container"}
      />
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/sample" element={<AddSampleData></AddSampleData>} />

        <Route element={<PrivateRoutes></PrivateRoutes>}>
          <Route path="/user" element={<Navbar></Navbar>} >
            <Route path="dashboard" element={<Dashboard></Dashboard>}></Route>
            <Route path="testForm" element={<TestForm></TestForm>}></Route>
            <Route path="profile" element={<Profile />} />
            <Route path="add-expense" element={<ExpenseForm />} />
            <Route path="expenses" element={<ExpenseList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="budget-form" element={<BudgetForm />} />
          </Route>
        </Route>
      </Routes>

    </div>
  );
}

export default App;
