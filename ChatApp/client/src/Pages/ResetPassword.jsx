import '../styles/Auth.css';
import { useParams ,useNavigate } from 'react-router-dom';
import { useEffect ,useState  } from 'react';
import toast from 'react-hot-toast';
import api from '../api/api';
import { Form, Input , Button ,Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ResetPassword = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (token.length !== 64) {
            toast.error("Invalid Token", {
                duration: 2500,
                removeDelay: 500,
            });
            navigate('/login');
            return;
        }
    },[]);

    const handleSubmit = async (values) =>{
        const formData = values;
        const newPassword = formData.password;
        
        if(new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/).test(newPassword) === false) {
            toast.error("Weak Password", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        if(newPassword !== formData.cpassword) {
            toast.error("Passwords do not match", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }
        setLoading(true);
        try{
            const res = await api.post(`/recovery/reset/${token}`,{ newPassword });
            if(res.status === 200){
                toast.success(res.data.message, {
                    duration: 2500,
                    removeDelay: 500,
                });
                navigate('/login');
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong", {
                duration: 2500,
                removeDelay: 500,
            });
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Change Password</h1>
                    <p>Enter your new password below</p>
                </div>
                <Form
                    className='auth-form'
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                        <Form.Item
                            label="Password"
                            name="password"
                            layout='vertical'
                            className='form-group'
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password  className='form-input'/>
                        </Form.Item>
                        <Form.Item
                            label="Confirme Password"
                            name="cpassword"
                            layout='vertical'
                            className='form-group'
                            rules={[{ required: true, message: 'Please input your Confirme Passoword!' }]}
                        >
                            <Input.Password  className='form-input'/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                            {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} /> : "Reset Password"}
                        </Button>
                </Form>
            </div>
        </div>
    );
}


export default ResetPassword;
