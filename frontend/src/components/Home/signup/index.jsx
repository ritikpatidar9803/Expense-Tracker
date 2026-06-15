import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { Link } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import { useState } from "react";
import { toast } from "react-toastify";
import http from "../../../utils/http";


const { Item } = Form;

export default function Signup() {
    const[signupForm] = Form.useForm()
    const [formData, setFormData] = useState(null);
    const [otp, setOtp] = useState(null)
    const [loading, setLoading] = useState(false);

    const onFinish = async(values) =>{
        try{
            const {data} = await http.post("/api/user/send-mail",values);
            setOtp(data.otp);
            setFormData(values);
            toast.success("Email sent");
            
        }catch(err){
            toast.error(err.response ? err.response.data.message : err.message)
            setOtp(null)
            setFormData(null);
        } finally {
            setLoading(false);
        }
    }

    const onSignup = async(values) =>{
        try{
            if(Number(values.otp) !== Number(otp))
                return toast.error("Incorrect OTP");

            setLoading(true);
            await http.post("/api/user/signup",formData);
            toast.success("Signup success");
            setOtp(null)
            setFormData(null);
            signupForm.resetFields();
        }catch(err){
            toast.error(err.response ? err.response.data.message : err.message)
        } finally {
            setLoading(false);
        }
    }


    return (
        <Homelayout>
            <div className="flex">
                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img src="/exp-img.jpg" alt="Bank" className="w-4/5 object-contain" />
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                    <Card className="w-full max-w-sm shadow-xl">
                        <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
                            Track Your Expense
                        </h2>
                        {
                            otp ?
                            <Form name="otp-form" layout="vertical"  onFinish={onSignup}>
                            <Item name="otp" label="OTP" rules={[{ required: true }]}>
                                <Input.OTP prefix={<UserOutlined />} placeholder="enter otp" />
                            </Item>

                            <Item>
                                <Button loading={loading} type="text" htmlType="submit" block className="!bg-[#FF735C] !text-white !font-bold">
                                    Verify Now
                                </Button>
                            </Item>
                        </Form>
                        :
                        <Form name="signup-form" layout="vertical" onFinish={onFinish} form ={signupForm}>
                            <Item name="fullname" label="Fullname" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} placeholder="Enter your fullname" />
                            </Item>

                            <Item name="mobile" label="Mobile" rules={[{ required: true }]}>
                                <Input prefix={<PhoneOutlined />} placeholder="Enter your mobile no." />
                            </Item>

                            <Item name="email" label="Email" rules={[{ required: true }]}>
                                <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                            </Item>

                            <Item name="password" label="Password" rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
                            </Item>

                            <Item>
                                <Button loading={loading} type="text" htmlType="submit" block className="!bg-[#FF735C] !text-white !font-bold">
                                    Signup
                                </Button>
                            </Item>
                        </Form>
                        }
                        <div className="flex items-center justify-between">
                            {
                                otp ? 
                                <Link style={{textDecoration: "underline"}} onClick ={()=>setOtp(null)} className="!text-[#FF735C] !font-bold">
                            Change Email
                        </Link>: <div></div>
                            }
                            <Link style={{ textDecoration: "underline" }} to="/" className="!text-[#FF735C] !font-bold">
                                Already have an account ?
                            </Link>

                        </div>
                    </Card>

                </div>

            </div>
        </Homelayout>
    )
}