import React from "react";
import axios from "axios";
import sampleExpenses from "./sample_expenses.json";
import { Navbar } from "../layouts/Navbar";
export const AddSampleData = () => {

    const addExpenses = async () => {
        try {
          for (const expense of sampleExpenses) {
            await axios.post("/expense", expense);
          }
          alert("Sample expenses added successfully!");
        } catch (error) {
          console.error("Error adding sample expenses:", error);
          alert("Failed to add sample expenses.");
        }
      };

    
  return (
    <div style={{textAlign:"center",marginTop:"10rem"}}>
        <Navbar></Navbar>
        <h3>AddSampleData</h3>
        <button onClick={()=>addExpenses()}>Add </button>
    </div>
  )
}
