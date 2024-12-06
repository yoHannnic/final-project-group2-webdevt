import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Table, DatePicker, message } from "antd"; // Import Table and message from Ant Design
import {UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import Layout from "./../components/Layout/Layout"; // Import Layout component
import Analytics from "./../components/Analytics";
import axios from "axios"; // Import Axios for API calls
import { Spinner } from "react-bootstrap"; // Example spinner
import moment from "moment";
const {RangePicker} = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState(7);
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render : (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text,record) => (
        <div>
          <EditOutlined 
          onClick={() => {
            setEditable(record);
            setShowModal(true);
          }} 
          />
          <DeleteOutlined className="mx-2" 
          onClick={() => {
            handleDelete(record);
            }} />
        </div>
      )
    },
  ];

  // useEffect Hook
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/transactions/get-transaction", { userid: user._id, frequency, selectedDate, type });
        setLoading(false);
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue with Transaction");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  //delete handler

  const handleDelete = async (record) => {
    try {
      setLoading(true)
      await axios.post("/transactions/delete-transaction", {transactionID: record._id,
      });
      setLoading(false)
      message.success('Transaction Deleted');
    } catch (error) {
      setLoading(false)
      console.log(error)
      message.error('Unable to delete')
    }
  }

  // Form submission handler
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if(editable){
        await axios.post("/transactions/edit-transaction", { 
          payload:{
            ...values,
            userID:user._id
          },
          transactionID: editable._id
          });
        setLoading(false);
        message.success("Transaction Updated Successfully");
      }else{
        await axios.post("/transactions/add-transaction", {
           ...values, 
           userid: user._id,
           });
      setLoading(false);
      message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Failed to Add Transaction");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value = {frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value='7'>LAST 1 Week</Select.Option>
            <Select.Option value='30'>LAST 1 Month</Select.Option>
            <Select.Option value='365'>LAST 1 Year</Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedate(values)} />}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value = {type} onChange={(values) => setType(values)}>
            <Select.Option value='all'>ALL</Select.Option>
            <Select.Option value='income'>INCOME</Select.Option>
            <Select.Option value='expense'>EXPENSE</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedate(values)} />}
        </div>
        <div className="switch-icons">
              <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData("table")}
              />
              <AreaChartOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData("analytics")}
              />
          </div>
        <div>
         
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === 'table' ?  
        <Table columns={columns} dataSource={allTransaction} /> 
        : <Analytics allTransaction={allTransaction}/>  
        }
       
      </div>
      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form layout="vertical" 
        onFinish={handleSubmit} 
        initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
