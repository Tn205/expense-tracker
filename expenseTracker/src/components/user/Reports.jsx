import { useState, useEffect } from "react";
import { Select, MenuItem, FormControl } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/Reports.css";

export const Reports = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // States
  const [expensesData, setExpensesData] = useState([]);
  const [budgetData, setBudgetData] = useState();
  const [allYears, setAllYears] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];


  // Load data from localStorage once
  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const budgets = JSON.parse(localStorage.getItem("budgets")) || [] ;
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const totalBudget = parseInt(localStorage.getItem("total_Budget")) || 0;


    setExpensesData(expenses);
    setBudgetData(budgets);
    setAllCategories(categories);
    setTotalBudget(totalBudget);

    // Generate all years from 2020 to current year
    const years = [];
    const startYear = 2020;
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    
    setAllYears(years);
    setDataLoaded(true);
  }, []);



  // Process data immediately in render
  const filteredExpenses = expensesData.filter(({ date }) => {
    try {
      const dateParts = date.split("/");
      if (dateParts.length !== 3) return false;
      
      const month = parseInt(dateParts[1]);
      const year = dateParts[2];
      
      return month === selectedMonth && year === selectedYear.toString();
    } catch (error) {
      console.error("Error filtering expense:", error);
      return false;
    }
  });

  // Calculate spending per category
  const categorySpending = {};
  filteredExpenses.forEach(({ category, amount }) => {
    if (category && category.name) {
      categorySpending[category.name] = (categorySpending[category.name] || 0) + amount;
    }
  });

  // Map budgets per category
  const budgetMapping = {};
  budgetData?.map(({ categoryName, amount }) => {
    budgetMapping[categoryName] = amount;
  });


  // Prepare table data
  const tableData = allCategories.map(category => ({
    categoryName: category.name,
    spent: categorySpending[category.name] || 0,
    budget: budgetMapping[category.name] || "-",
  }));

  // Calculate total spending
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Prepare chart data
  const chartLabels = Object.keys(categorySpending);
  const chartDataValues = Object.values(categorySpending);

  const pieData = {
    labels: chartLabels,
    datasets: [{ 
      data: chartDataValues, 
      backgroundColor: ["#4ecdc4", "#ff6b6b", "#ffe66d", "#1a535c", "#f7fff7", "#ff9f1c", "#2ec4b6"],
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: chartLabels,
    datasets: [{ 
      label: "Amount Spent", 
      data: chartDataValues, 
      backgroundColor: "rgba(78, 205, 196, 0.7)",
      borderColor: "rgba(78, 205, 196, 1)",
      borderWidth: 1,
      borderRadius: 5,
      hoverBackgroundColor: "rgba(78, 205, 196, 0.9)",
    }],
  };

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="reports-container">
      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>
      
      <div className="reports-content">
        <h1 className="page-title">Financial Report</h1>
        
        <div className="filters-section">
          <div className="date-filters">
            <div>
              <p className="filter-label">Month</p>
              <FormControl className="date-picker">
                <Select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  MenuProps={{
                    classes: { paper: 'select-dropdown' },
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  className="glass-select"
                  sx={{
                    color: '#ffffff',
                    '& .MuiSvgIcon-root': {
                      color: '#ffffff'
                    }
                  }}
                >
                  {months.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            
            <div>
              <p className="filter-label">Year</p>
              <FormControl className="date-picker">
                <Select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  MenuProps={{
                    classes: { paper: 'select-dropdown' },
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  className="glass-select"
                  sx={{
                    color: '#ffffff',
                    '& .MuiSvgIcon-root': {
                      color: '#ffffff'
                    }
                  }}
                >
                  {allYears.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        
        {dataLoaded ? (
          <>
            <div className="charts-container">
              <div className="chart-wrapper">
                <h3 className="chart-title">Category Breakdown</h3>
                <div className="table-container">
                  <table className="budget-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount Spent</th>
                        <th>Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map(({ categoryName, spent, budget }, index) => (
                        <tr key={index}>
                          <td>{categoryName}</td>
                          <td>₹{spent.toLocaleString()}</td>
                          <td>{budget === "-" ? "-" : `₹${parseInt(budget).toLocaleString()}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="chart-wrapper">
                <h3 className="chart-title">Spending Distribution</h3>
                <div className="chart-container">
                  {chartLabels.length > 0 ? (
                    <Pie data={pieData} options={chartOptions} />
                  ) : (
                    <div className="no-data-message">
                      <span>No data available for this period</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-wrapper">
                <h3 className="chart-title">Monthly Spending</h3>
                <div className="chart-container">
                  {chartLabels.length > 0 ? (
                    <Bar data={barData} options={chartOptions} />
                  ) : (
                    <div className="no-data-message">
                      <span>No data available for this period</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="chart-wrapper summary-box">
                <h3 className="chart-title">Financial Summary</h3>
                <div className="summary-details">
                  <div className="summary-item">
                    <p className="summary-title">Total Budget</p>
                    <p className="summary-amount">₹{totalBudget.toLocaleString()}</p>
                  </div>
                  
                  <div className="summary-item">
                    <p className="summary-title">Total Spent</p>
                    <p className="summary-amount">₹{totalSpent.toLocaleString()}</p>
                  </div>
                  
                  <div className="summary-item">
                    <p className="summary-title">
                      {totalBudget - totalSpent >= 0 ? "Remaining" : "Over Budget"}
                    </p>
                    <p className={`summary-amount ${totalBudget - totalSpent >= 0 ? "positive" : "negative"}`}>
                      ₹{Math.abs(totalBudget - totalSpent).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading your financial data...</p>
          </div>
        )}
      </div>
    </div>
  );
};
