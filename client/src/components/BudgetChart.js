import React from 'react'
import { Chart } from 'react-google-charts'

export default function BudgetChart({ budget, categories }) {
    const data = [["Category", "Amount Allocated"]];

    if(budget && categories){
        data.push(["Remaining Amout", budget.remaining_amount])
        categories.forEach((cat) => {
            data.push([cat.title, cat.amount])
        })
    }
      
    const options = {
        title: budget?.title || '',
        backgroundColor: "transparent",
        is3D: true,
        titleTextStyle: {
            color: '#B2BEB5'
        },
        legendTextStyle: {
            color: '#B2BEB5'
        },
      }

  return budget && categories ? (
    <>
        <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width="100%"
        height="400px"
        />
    </>
  ) : <><br/><h1>Loading...</h1></>;
}
