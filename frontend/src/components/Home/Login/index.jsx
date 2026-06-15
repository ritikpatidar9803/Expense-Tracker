import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { toast } from "react-toastify";
import http from "../../../utils/http";

const { Item } = Form;

export default function Login() {

    const navigate = useNavigate()
    const [loginForm] = Form.useForm();
    const [loading, setLoading] = useState(false);


    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { data } = await http.post("/api/user/login", values);
            const {role} = data;
            if(role === "admin")
                return navigate("/app/admin/dashboard")

            if(role === "user")
                return navigate("/app/user/dashboard")

            toast.success("Login Success");
        } catch (err) {
            toast.error(err.response ? err.response.data.message : err.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex">
            <div className="w-1/2 hidden md:flex items-center justify-center">
                <img src="/exp-img.jpg" alt="Bank" className="w-4/5 object-contain" />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                <Card className="w-full max-w-sm shadow-xl">
                    <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
                        Track Your Expense
                    </h2>
                    <Form name="login-form" layout="vertical" onFinish={onFinish} form={loginForm}>
                        <Item name="email" label="Email" rules={[{ required: true }]}>
                            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                        </Item>
                        <Item name="password" label="Password" rules={[{ required: true }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
                        </Item>
                        <Item>
                            <Button loading={loading} type="text" htmlType="submit" block className="!bg-[#FF735C] !text-white !font-bold">
                                Login
                            </Button>
                        </Item>
                    </Form>
                    <div className="flex items-center justify-between">
                        <Link style={{ textDecoration: "underline" }} to="/forgot-password" className="!text-[#FF735C] !font-bold">
                            Forgot Password
                        </Link>
                        <Link style={{ textDecoration: "underline" }} to="/signup" className="!text-[#FF735C] !font-bold">
                            Don't have an account ?
                        </Link>

                    </div>
                </Card>

            </div>

        </div>
    )
}