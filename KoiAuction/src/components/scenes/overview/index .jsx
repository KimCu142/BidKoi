import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
// import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import api from "../../../config/axios";
import LineChartExample from "../line";
import RevenueChart from "../line";
import RevenueLineChart from "../line";

function Overview() {
  const [userData, setUserData] = useState();
  const [breederData, setBreederData] = useState();
  const [staffData, setStaffData] = useState();

  const fetchData = async () => {
    try {
      const userResponse = await api.get(`/account/number/bidder`);
      setUserData(userResponse.data);

      const breederResponse = await api.get(`/account/number/breeder`);
      setBreederData(breederResponse.data);

      const staffResponse = await api.get(`/account/number/staff`);
      setStaffData(staffResponse.data);
    } catch (err) {
      console.log("Fail to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col span={8}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card bordered={false}>
              <Statistic
                title="Total Users"
                value={userData?.data}
                valueStyle={{
                  color: "#3f8600",
                  fontWeight: "bold",
                }}
                suffix="users"
              />
            </Card>
          </motion.div>
        </Col>
        <Col span={8}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card bordered={false}>
              <Statistic
                title="Total Breeders"
                value={breederData?.data}
                valueStyle={{
                  color: "#4685af",
                  fontWeight: "bold",
                }}
                suffix="breeders"
              />
            </Card>
          </motion.div>
        </Col>
        <Col span={8}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card bordered={false}>
              <Statistic
                title="Total Staff"
                value={staffData?.data}
                valueStyle={{
                  color: "#d4163c",
                  fontWeight: "bold",
                }}
                suffix="staff"
              />
            </Card>
          </motion.div>
        </Col>
        <RevenueLineChart />
      </Row>
    </div>
  );
}

export default Overview;
