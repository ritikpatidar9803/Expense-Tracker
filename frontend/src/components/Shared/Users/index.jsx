import { EyeInvisibleFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Card, Table, Form, Select } from "antd";
import { toast } from "react-toastify";
import http from '../../../utils/http';
import fetcher from '../../../utils/fetcher';
import useSWR from 'swr';
import { mutate } from 'swr';
import { formatDate } from "../../../utils/date";
import { useEffect, useState } from "react";




const Users = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [no, setNo] = useState(0);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
        total: 0
    });


    const columns = [
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            className: "capitalize"
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            className: "capitalize"
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            className: "capitalize"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => formatDate(date)
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            className: "capitalize",
            render: (status, obj) => (
                status ?
                    <Button
                        className="!bg-green-500 !text-white"
                        shape="circle"
                        icon={<EyeOutlined />}
                        onClick={() => onStatus(obj)}
                        loading={loading}
                    />
                    :
                    <Button
                        className="!bg-rose-400 !text-white"
                        shape="circle"
                        icon={<EyeInvisibleFilled />}
                        onClick={() => onStatus(obj)}
                        loading={loading}
                    />
            )
        },
    ]

    // const { data: users, error, isLoading } = useSWR(
    //     "/api/user/get",
    //     fetcher
    // )
    const fetchUsers = async (page = 1, pageSize = 5) => {
        try {
            setLoading(true);
            const res = await http.get(`/api/user/get?page=${page}&limit=${pageSize}`);
            const { data, total } = res.data;
            setUsers(data);
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
        fetchUsers(pagination.current, pagination.pageSize);
    }, [no])

    const onStatus = async (obj) => {
        try {
            setLoading(true)
            await http.put(`/api/user/status/${obj._id}`, { status: !obj.status });
            toast.success("Status Updated successfully !");
            setNo(no+1);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }
    const handleTableChange = (pagination) =>{
        fetchUsers(pagination.current, pagination.pageSize)
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

                        </div>
                    }
                >
                    
                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={users}
                        scroll={{ x: "max-content" }}
                        loading={loading}
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                </Card>
            </div>

        </div>
    )
}

export default Users;