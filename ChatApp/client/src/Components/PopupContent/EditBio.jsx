
import { useState } from 'react';
import "../../styles/Auth.css";
import { Form, Input , Button ,Spin  } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useUserStore } from '../../store/userStore';
import toast from 'react-hot-toast';



const EditBio = ({setUserInfo}) => {
    const [loading , setLoading] = useState(false);
    const { updateBio } = useUserStore();

    const handleSubmit = async (values) => {
        setLoading(true);
        try{
            await updateBio(values.bio);
            setUserInfo(prev => ({...prev, bio: values.bio}));
            toast.success("Biography updated successfully", {
                duration: 2500,
                removeDelay: 500,
            });
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong", {
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
                <h1>Edit Biography</h1>
                <p>You can change your Biography any time</p>
            </div>
            <Form 
                className="auth-form"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Biography"
                    name="bio"
                    layout='vertical'
                    className="form-group"
                    rules={[{ required: true, message: 'Please input your new Biography!' }]}
                >
                    <Input.TextArea
                        className="form-input" 
                        placeholder="Enter new Bio" 
                        disabled={loading} 
                        rows={4} 
                    />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="auth-button" disabled={loading}>
                    {loading ? <Spin  indicator={<LoadingOutlined style={{fontSize: 24,fontWeight:'bolder',color: "#fff" }} spin />} /> : "Edit Biography"}
                </Button>
            </Form>
        </div>
    )
}

export default EditBio;