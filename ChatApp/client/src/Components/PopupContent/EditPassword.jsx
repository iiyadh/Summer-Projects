import { useState  } from 'react';
import "../../styles/Auth.css";
import toast from 'react-hot-toast';
import { Form, Input , Button ,Spin  } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useUserStore } from '../../store/userStore';




const EditPassword = () => {
    const [loading , setLoading] = useState(false);
    const { updatePassword } = useUserStore();

    const handleSubmit = async (values) => {
        const formData = values;
        const data = {
            oldPassword: formData.Opass,
            newPassword: formData.pass,
            
        };
        
        if(data.newPassword !== formData.Cpass) {
            toast.error("Passwords do not match",{
                duration: 2500,
                removeDelay:500,
            });
            return;
        }

        if(new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/).test(data.newPassword) === false) {
            toast.error("Weak Password", {
                duration: 2500,
                removeDelay: 500,
            });
            return;
        }

        setLoading(true);
        try{
            setLoading(false);
            await updatePassword(data.newPassword, data.oldPassword);
            toast.success("Password updated successfully", {
                duration: 2500,
                removeDelay: 500,
            });
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to update password", {
                duration: 2500,
                removeDelay: 500,
            });
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="generic-container">
            <div className="auth-header">
                <h1>Change Password</h1>
                <p>You can change your Password any time</p>
            </div>
            <Form 
                className="auth-form"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Old Password"
                    name="Opass"
                    layout='vertical'
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your old Password!' }]}
                >
                    <Input.Password
                        className="form-input"
                        placeholder="Enter your old Password"
                        disabled={loading}
                    />
                </Form.Item>
                <Form.Item
                    label="New Password"
                    name="pass"
                    layout='vertical'
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your new Password!' }]}
                >
                    <Input.Password
                        className="form-input"
                        placeholder="Enter new Password"
                        disabled={loading}
                    />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="Cpass"
                    layout='vertical'
                    className="form-group"
                    rules={[{ required: true, message: 'Please confirm your new Password!' }]}
                >
                    <Input.Password
                        className="form-input"
                        placeholder="Confirm your password"
                        disabled={loading}
                    />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                   {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} /> : "Change Password"}
                </Button>
            </Form>
        </div>
    )
}

export default EditPassword;