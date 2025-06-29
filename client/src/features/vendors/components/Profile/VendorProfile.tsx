import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { Button, Card, Form, Input, Row, Col, Divider, Upload, Avatar } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined, KeyOutlined, ShopOutlined, PhoneOutlined, EnvironmentOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';
import classes from './VendorProfile.module.css';
import { toast } from 'react-toastify';

interface VendorProfileData {
  name: string;
  email: string;
  businessName: string;
  phone_number: string;
  profilePicture?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  addresses: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const VendorProfile: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userData, token, refreshAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Helper function to format image URL
  const formatImageUrl = (imagePath: string | null): string | undefined => {
    if (!imagePath) return undefined;
    // If it already has http, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the backend URL
    return `http://localhost:3333${imagePath}`;
  };

  useEffect(() => {
    if (userData) {
      // Set profile picture with proper URL formatting
      setProfilePicture(userData.profilePicture);
      
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        businessName: userData.businessName,
        phone_number: userData.phone_number,
        addresses: {
          street: userData.addresses?.street || '',
          city: userData.addresses?.city || '',
          state: userData.addresses?.state || '',
          postalCode: userData.addresses?.postalCode || '',
          country: userData.addresses?.country || '',
        },
      });
    }
  }, [userData, form]);

  const updateProfile = async (values: VendorProfileData) => {
    try {
      const response = await fetch('http://localhost:3333/vendor/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          businessName: values.businessName,
          phone_number: values.phone_number,
          profilePicture: profilePicture,
          addresses: values.addresses,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const onFinish = async (values: VendorProfileData) => {
    try {
      setLoading(true);
      await updateProfile(values);
      toast.success('Profile updated successfully');
      
      if (values.newPassword) {
        toast.success('Password updated successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vendor account? This action cannot be undone.')) {
      try {
        await fetch(`http://localhost:3333/vendor/${userData?.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Vendor account deleted successfully');
        setTimeout(() => navigate('/vendor/signin'), 1500);
      } catch (error) {
        toast.error('Failed to delete vendor account');
      }
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3333/upload/profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const result = await response.json();
      setProfilePicture(result.filePath);
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (!userData) return <div className="text-center mt-5">You are not logged in.</div>;

  return (
    <div className={classes.profileContainer}>
      <Card className={classes.profileCard}>
        <div className={classes.header}>
          <h1>Vendor Profile</h1>
          <p className={classes.subtitle}>Manage your business account settings and preferences</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ 
            name: userData?.name, 
            email: userData?.email,
            businessName: userData?.businessName,
            phone_number: userData?.phone_number,
            addresses: {
              street: userData?.addresses?.street || '',
              city: userData?.addresses?.city || '',
              state: userData?.addresses?.state || '',
              postalCode: userData?.addresses?.postalCode || '',
              country: userData?.addresses?.country || '',
            },
          }}
          size="large"
          className={classes.form}
        >
          <div className={classes.section}>
            
            {/* Profile Picture Section */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Avatar 
                size={120} 
                src={profilePicture ? formatImageUrl(profilePicture) : undefined}
                icon={<UserOutlined />}
                style={{ marginBottom: '1rem' }}
              />
              <div>
                <Upload
                  name="profilePicture"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      toast.error('You can only upload image files!');
                      return false;
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      toast.error('Image must be smaller than 2MB!');
                      return false;
                    }
                    handleProfilePictureUpload(file);
                    return false; // Prevent auto upload
                  }}
                  onChange={(info) => {
                    if (info.file.status === 'removed') {
                      setProfilePicture(null);
                    }
                  }}
                >
                  <Button icon={<CameraOutlined />} type="dashed" loading={uploading}>
                    {uploading ? 'Uploading...' : 'Change Profile Picture'}
                  </Button>
                </Upload>
              </div>
            </div>
            
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </div>

          <Divider className={classes.divider} />

          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <ShopOutlined className={classes.sectionIcon} />
              <h2>Business Information</h2>
            </div>
            <Form.Item
              name="businessName"
              label="Business Name"
              rules={[{ required: true, message: 'Please input your business name!' }]}
            >
              <Input placeholder="Business Name" />
            </Form.Item>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </div>

          <Divider className={classes.divider} />

          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <EnvironmentOutlined className={classes.sectionIcon} />
              <h2>Business Address</h2>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['addresses', 'street']}
                  label="Street Address"
                >
                  <Input placeholder="Street Address" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['addresses', 'city']}
                  label="City"
                >
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['addresses', 'state']}
                  label="State/Province"
                >
                  <Input placeholder="State/Province" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['addresses', 'postalCode']}
                  label="Postal Code"
                >
                  <Input placeholder="Postal Code" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['addresses', 'country']}
                  label="Country"
                >
                  <Input placeholder="Country" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider className={classes.divider} />

          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <KeyOutlined className={classes.sectionIcon} />
              <h2>Change Password</h2>
            </div>
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                { required: form.getFieldValue('newPassword'), message: 'Please input your current password!' }
              ]}
            >
              <Input.Password placeholder="Current Password" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password placeholder="New Password" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  dependencies={['newPassword']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm New Password" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className={classes.actions}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              className={classes.submitButton}
            >
              Save Changes
            </Button>
            <Button
              danger
              onClick={handleDelete}
              className={classes.deleteButton}
            >
              Delete Account
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
