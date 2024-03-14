import { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Typography,
  Divider,
  notification,
  Tag,
} from "antd";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Passbook = () => {
  const [passbookData, setPassbookData] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    const fetchPassbookData = async () => {
      try {
        let params = {};
        if (selectedDates.length === 2) {
          params = {
            from: selectedDates[0],
            to: selectedDates[1],
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize,
          };
        }

        const response = await axios.get(
          `${process.env.API_URL}/account/passbook`,
          {
            params,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPassbookData(response.data.transactions);
      } catch (error) {
        notification.error({
          message: "Error fetching passbook data",
        });
      }
    };

    fetchPassbookData();
  }, [selectedDates, pagination]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "timeStamp",
      render: (date) => (
        <span>
          {new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span> &#8377;{amount}</span>,
    },
    {
      title: "Credit/Debit",
      dataIndex: "isCredit",
      key: "type",
      render: (isCredit) => (
        <Tag color={isCredit ? "green" : "red"}>
          {isCredit ? "Credit" : "Debit"}
        </Tag>
      ),
    },
    {
      title: "Account Number",
      dataIndex: "otherPartyUserId",
      key: "receiverId",
      render: (otherPartyUserId) => <span>{otherPartyUserId}</span>,
    },
  ];

  const handleDateChange = (dates) => {
    setSelectedDates(dates.map((date) => date.format("YYYY-MM-DD")));
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Divider orientation='left'>
        <Title level={3} style={{ fontSize: "24px" }}>
          Passbook
        </Title>
      </Divider>
      <RangePicker format='YYYY-MM-DD' onChange={handleDateChange} />
      <Table
        bordered
        fixed
        dataSource={passbookData}
        columns={columns}
        pagination={{ ...pagination, position: ["bottomCenter"] }}
        onChange={handleTableChange}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default Passbook;
