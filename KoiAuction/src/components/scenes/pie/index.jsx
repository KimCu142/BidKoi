import React, { useEffect, useState } from "react";
import { Cell, PieChart } from "recharts";
import api from "../../../config/axios";

function Pie() {
  const [data, setData] = useState();

  const fetchData = async () => {
    try {
      const response = await api.get("");
      setData(response.data);
    } catch (err) {
      console.log("Fail to fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <PieChart width={730} height={250}>
        <Pie
          data={data?.topProduct}
          dataKey="totalValue"
          nameKey="Kohaku"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
        >
          {data?.topProduct.map((item, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

export default Pie;
