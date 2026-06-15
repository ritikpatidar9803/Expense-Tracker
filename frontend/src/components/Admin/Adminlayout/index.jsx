import { AppstoreAddOutlined, BarChartOutlined, DollarOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import Loader from "../../Shared/Loader";
import { toast } from "react-toastify";
import http from "../../../utils/http";
const {Sider, Header, Content, Footer} = Layout;

const items = [
    {
        key:"/app/admin/dashboard",
        label:"Dashboard",
        icon: <AppstoreAddOutlined/>
    },
    {
        key:"/app/admin/report",
        label:"Reports",
        icon: <BarChartOutlined/>
    },
    {
        key:"/app/admin/users",
        label:"Users",
        icon: <UserOutlined/>
    }
]

const AdminLayout = () =>{
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleNavigate = (menu) =>{
        navigate(menu.key)
    }

    const logout = async() =>{
        try {
            setLoading(true)
            await http.get("/api/user/logout");
            sessionStorage.removeItem("userInfo")
            navigate("/");
            setLoading(false)
            
        } catch (err) {
            setLoading(false)
            toast.error(err.response ? err.response.data.message : err.message)
        }
    }
   

    const siderStyle = {
        overflow:'auto',
        height:'100vh',
        position:'sticky',
        insetInlineStart:0,
        top:0,
        bottom:0,
        scrollbarWidth:'thin',
        scrollbarGutter:'stable'
    }
    const headerStyle={
        position:'sticky',
        top:0,
        zIndex:1,
        width:'100%',
        display:'flex',
        padding:0,
    }
    const {token:{ colorBgContainer, borderRadiusLG}} = theme.useToken();

    return(
        <Layout className="!min-h-screen">
            <Sider collapsible collapsed={open} style={siderStyle}>
                <div className="flex items-center justify-center my-4">
                     <Image src="/logo.webp" width={60} height={60} alt="logo" className="rounded-full mx-auto mb-3"/>
                </div>
                <Menu defaultSelectedKeys={[pathname]} theme="dark" items={items} onClick={handleNavigate}/>
            </Sider>
            <Layout>
                <Header style={headerStyle} className="flex items-center justify-between !px-5 !bg-white !shadow">
                    <Button icon={<MenuOutlined/>} onClick={()=>setOpen(!open)}/>
                    <Button icon={<LogoutOutlined/>} onClick={logout} loading={loading}/>
                </Header>
                <Content style={{
                    margin: '4px 8px',
                    padding: 4,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG
                }}>
                    <Outlet/>
                </Content>
            </Layout>

        </Layout>
    )
}

export default AdminLayout;