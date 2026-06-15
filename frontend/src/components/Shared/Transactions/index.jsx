import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Card, Table, Popconfirm, Modal, Form, Select } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import http from '../../../utils/http';
import fetcher from '../../../utils/fetcher';
import useSWR from 'swr';
import { setNo } from 'swr';
import { formatDate } from "../../../utils/date";
import { useEffect } from "react";
const { Item } = Form;

const Transactions = () => {
    const [transactionForm] = Form.useForm();

    const [edit, setEdit] = useState(null)
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const [transactions, setTransactions] = useState([]);
    const [no, setNo] = useState(0);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
        total: 0
    });

    const columns = [
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            key: "transactionType",
            className: "capitalize"
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            className: "capitalize"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            className: "capitalize"
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            className: "capitalize"
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
            className: "capitalize"
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => formatDate(date)
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, obj) => (
                <div className="flex gap-1">
                    <Popconfirm
                        title="Are you sure ?"
                        description="Once you update, You can also re-update !"
                        onCancel={() => toast.info("No Changes occur !")}
                        onConfirm={() => onEditTransaction(obj)}
                    >
                        <Button type="text" className="!bg-green-100 !text-green-500" icon={<EditOutlined />} />
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure ?"
                        description="Once you delete, You can not re-store !"
                        onCancel={() => toast.info("Your data is safe !")}
                        onConfirm={() => onDelete(obj._id)}
                    >
                        <Button type="text" className="!bg-red-100 !text-red-500" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        },
    ]

    // const {data:transactions, error, isLoading} = useSWR(
    //     "/api/transaction/get",
    //     fetcher
    // )
    const fetchTransactions = async (page = 1, pageSize = 5) => {
        try {
            setLoading(true);
            const res = await http.get(`/api/transaction/get?page=${page}&limit=${pageSize}`);
            const { data, total } = res.data;
            setTransactions(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total
            })
        } catch (err) {
            toast.error("Failed to fetch transactions")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions(pagination.current, pagination.pageSize);
    }, [no])

    const onFinish = async (values) => {
        try {
            setLoading(true)
            await http.post("/api/transaction/create", values);
            toast.success("Transaction created successfully !");
            setNo(no+1);
            setModal(false);
            transactionForm.resetFields();
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true)
            await http.put(`/api/transaction/update/${edit._id}`, values);
            toast.success("Transaction updated successfully !");
            setNo(no+1);
            setModal(false);
            transactionForm.resetFields();
            setEdit(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
            setEdit(null)
        }
    }

    const onDelete = async (id) => {
        try {
            setLoading(true)
            await http.delete(`/api/transaction/delete/${id}`);
            toast.success("Transaction deleted successfully !");
            setNo(no+1);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }

    const onEditTransaction = async (obj) => {
        setEdit(obj);
        transactionForm.setFieldsValue(obj);
        setModal(true);
    }
    const handleTableChange = (pagination) =>{
        fetchTransactions(pagination.current, pagination.pageSize)
    }

    return (
        <div>
            <div className="grid">
                <Card
                    title="Transaction List"
                    style={{ overflowX: "auto" }}
                    extra={
                        <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">
                            <Input placeholder="Search by all" prefix={<SearchOutlined />} />
                            <Button type="text" className="!font-bold !bg-blue-500 !text-white" onClick={() => setModal(true)}>
                                Add new transaction
                            </Button>
                        </div>
                    }
                >
                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={transactions}
                        scroll={{ x: "max-content" }}
                        loading={loading}
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                </Card>
            </div>
            <Modal open={modal} onCancel={() => {
                setModal(false);
                setEdit(null);
                transactionForm.resetFields();
            }} title="Add new transaction" footer={null}>
                <Form layout="vertical" form={transactionForm} onFinish={edit ? onUpdate : onFinish}>
                    <div className="grid md:grid-cols-2 gap-x-3">
                        <Item label="Transaction Type" name="transactionType" rules={[{ required: true }]}>
                            <Select
                                placeholder="Transaction Type"
                                options={[
                                    { label: "CR", value: "cr" },
                                    { label: "DR", value: "dr" },
                                ]}
                            />
                        </Item>
                        <Item label="Amount" name="amount" rules={[{ required: true }]}>
                            <Input placeholder="Enter amount" type="number" />
                        </Item>
                        <Item label="Title" name="title" rules={[{ required: true }]}>
                            <Input placeholder="Enter title" />
                        </Item>
                        <Item label="Payment Method" name="paymentMethod" rules={[{ required: true }]}>
                            <Select
                                placeholder="Payment Method"
                                options={[
                                    { label: "Cash", value: "cash" },
                                    { label: "Online", value: "online" },
                                ]}
                            />
                        </Item>
                    </div>
                    <Item label="Notes" name="notes" rules={[{ required: true }]}>
                        <Input.TextArea placeholder="potato, tomato, etc" />
                    </Item>
                    <Item className="flex justify-end items-center">
                        <Button loading={loading} type="text" htmlType="submit" className={`!font-semibold !text-white ${edit ? "!bg-red-500" : "!bg-blue-500"}`}>
                            {edit ? "Update" : "Submit"}
                        </Button>
                    </Item>

                </Form>

            </Modal>
        </div>
    )
}

export default Transactions;