import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { Button, Card, Form, Input, message, Row, Col, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined, KeyOutlined } from '@ant-design/icons';
import classes from './AdminProfile.module.css';

interface AdminProfileData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const AdminProfile: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userData, token, refreshAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
    }
  }, [userData, form]);

  const updateProfile = async (values: AdminProfileData) => {
    try {
      const response = await fetch('http://localhost:3333/users/admin/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
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

  const onFinish = async (values: AdminProfileData) => {
    try {
      setLoading(true);
      await updateProfile(values);
      message.success('Profile updated successfully');
      if (values.newPassword) {
        message.success('Password updated successfully');
      }
      // Refresh the access token to get updated user data
      await refreshAccessToken();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.profileContainer}>
      <Card className={classes.profileCard}>
        <div className={classes.header}>
          <h1>Admin Profile</h1>
          <p className={classes.subtitle}>Manage your account settings and preferences</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ 
            firstName: userData?.firstName, 
            lastName: userData?.lastName, 
            email: userData?.email 
          }}
          size="large"
          className={classes.form}
        >
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <UserOutlined className={classes.sectionIcon} />
              <h2>Personal Information</h2>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
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
              <Input.Password prefix={<LockOutlined />} placeholder="Current Password" />
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
                  <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
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
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              className={classes.submitButton}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}; 