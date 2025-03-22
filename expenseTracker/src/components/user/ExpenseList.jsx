import React, { useState, useEffect, useRef } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, MenuItem, Select, InputLabel, FormControl, IconButton, TablePagination
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/ExpenseList.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ConfirmToast } from "../common/ConfirmToast";
import { useNavigate } from "react-router-dom";

export const ExpenseList = () => {
  const navigate = useNavigate();
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const isFirstRender = useRef(true);

  const [categories, setCategories] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    // alert("Hello");
    if (isFirstRender.current) {
      isFirstRender.current = false;
      getCategories();
      fetchExpenses();
    }
  }, []);

  useEffect(() => {
    let filtered = [...expensesData];
    if (dateRange.start) filtered = filtered.filter(expense => formatDate(expense.date) >= formatDate(dateRange.start));
    if (dateRange.end) filtered = filtered.filter(expense => formatDate(expense.date) <= formatDate(dateRange.end));
    if (amountRange.min) filtered = filtered.filter(expense => expense.amount >= amountRange.min);
    if (amountRange.max) filtered = filtered.filter(expense => expense.amount <= amountRange.max);
    if (selectedCategories.length > 0) filtered = filtered.filter(expense => selectedCategories.includes(expense.category.name));

    filtered.sort((a, b) => formatDate(b.date) - formatDate(a.date));
    setFilteredExpenses(filtered);

    if (page * rowsPerPage >= filtered.length) {
      setPage(0);
    }
  }, [dateRange, amountRange, selectedCategories, expensesData]);

  useEffect(() => {
    setPage(prev => Math.min(prev, Math.max(0, Math.ceil(filteredExpenses.length / rowsPerPage) - 1)));
  }, [filteredExpenses, rowsPerPage]);

  const getCategories = async () => {
    const categoriesData = localStorage.getItem("categories");
    setCategories(JSON.parse(categoriesData));
  }

  const fetchExpenses = async () => {
    try {
      const cachedExpenses = localStorage.getItem("expenses");
      if (cachedExpenses) {
        setExpensesData(JSON.parse(cachedExpenses));
      }

      const userId = localStorage.getItem("userid");
      const response = await axios.get(`/expenses/${userId}`);
      console.log(response.data);
      localStorage.setItem("expenses", JSON.stringify(response.data));
      setExpensesData(response.data);
    } catch (error) {
      setExpensesData([]);
      localStorage.removeItem("expenses");
      console.log("Error fetching expenses:", error.response?.data || error.message);
    }
  };


  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  // const handleDeleteExpense = async (expenseId) => {
  //   ConfirmToast("Are you sure you want to delete this expense?", async () => {
  //     const backupExpenses = [...filteredExpenses];
  //     const updatedExpenses = filteredExpenses.filter(expense => expense._id !== expenseId);
  //     setFilteredExpenses(updatedExpenses);
  //     setExpensesData(prev => prev.filter(expense => expense._id !== expenseId));

  //     const totalPages = Math.ceil(updatedExpenses.length / rowsPerPage);
  //     setPage(prevPage => (prevPage >= totalPages ? Math.max(0, totalPages - 1) : prevPage));

  //     toast.promise(
  //       axios.delete(`/expense/${expenseId}`).then((res) => {
  //         if (res.status === 200) {
  //           return "Expense deleted successfully! 🗑️";
  //         } else {
  //           throw new Error("Unexpected response status");
  //         }
  //       }),
  //       {
  //         pending: "Deleting expense...",
  //         success: "Expense deleted successfully! 🗑️",
  //         error: {
  //           render({ data }) {
  //             return data.response?.data?.message || "Failed to delete expense. Please try again.";
  //           },
  //         },
  //       }
  //     ).catch((error) => {
  //       console.error("Error deleting expense:", error.response?.data || error.message);
  //       setFilteredExpenses(backupExpenses);
  //       setExpensesData(backupExpenses);
  //     });
  //   });
  // };
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    const backupExpenses = [...filteredExpenses];
    const updatedExpenses = filteredExpenses.filter(expense => expense._id !== expenseId);
    setFilteredExpenses(updatedExpenses);
    setExpensesData(prev => prev.filter(expense => expense._id !== expenseId));

    const totalPages = Math.ceil(updatedExpenses.length / rowsPerPage);
    setPage(prevPage => (prevPage >= totalPages ? Math.max(0, totalPages - 1) : prevPage));

    try {
      await axios.delete(`/expense/${expenseId}`);
    } catch (error) {
      console.log("Error deleting expense:", error.response?.data || error.message);
      setFilteredExpenses(backupExpenses);
      setExpensesData(prev => [...prev, backupExpenses.find(expense => expense._id === expenseId)]);
    }
  };

  return (
    <div className="expense-list-wrapper">
      <div className="expense-list-container">
        <h2 className="page-title">Expense List</h2>

        <div className="filter-container">
          <TextField label="Start Date" type="date" className="filter-input" InputLabelProps={{ shrink: true }}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          <TextField label="End Date" type="date" className="filter-input" InputLabelProps={{ shrink: true }}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
          <TextField label="Min Amount" type="number" className="filter-input"
            onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })} />
          <TextField label="Max Amount" type="number" className="filter-input"
            onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })} />
          <FormControl className="filter-input">
            <InputLabel>Category</InputLabel>
            <Select multiple value={selectedCategories} onChange={(e) => setSelectedCategories(e.target.value)}>
              {categories?.map((category) => (
                <MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <button className="add-expense-btn" onClick={() => navigate("/user/add-expense")}>
            + Add Expense
          </button>
        </div>

        {filteredExpenses.length === 0 ? (<div className="no-expense-message">
          <h3>No expenses found for Your selection or no expenses added yet</h3>
          <p>Start tracking your expenses by adding a new one!</p>
        </div>) : (<div className="expenseData">
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date(dd/mm/yyyy)</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell>{expense.category.name}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteExpense(expense._id)}><DeleteIcon color="error" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination component="div" count={filteredExpenses.length} rowsPerPage={rowsPerPage} page={page}
            onPageChange={(event, newPage) => setPage(newPage)} rowsPerPageOptions={[5]} />
        </div>
        )}

      </div>
    </div>
  );
};