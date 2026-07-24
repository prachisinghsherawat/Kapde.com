import { Navigate } from 'react-router-dom';
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  signup,
} from '@/features/auth/authSlice';
import AuthCard from '@/components/auth/AuthCard';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  terms: boolean;
}

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <AuthCard
      title="Create your account"
      subtitle="Save your wishlist and check out faster."
      footer={{ text: 'Already have an account?', linkLabel: 'Sign in', to: '/login' }}
    >
      {error && <Alert type="error" message={error} showIcon className="mb-5" />}

      <Form<SignupForm>
        layout="vertical"
        requiredMark={false}
        onFinish={(values) =>
          void dispatch(
            signup({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
            }),
          )
        }
      >
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Form.Item
            name="firstName"
            label="First name"
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input
              prefix={<UserOutlined className="text-muted" />}
              placeholder="Priya"
              autoComplete="given-name"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last name"
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input placeholder="Sharma" autoComplete="family-name" />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'That does not look like an email address' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-muted" />}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please choose a password' },
            { min: 6, message: 'Use at least 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-muted" />}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || getFieldValue('password') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error('The two passwords do not match')),
            }),
          ]}
        >
          <Input.Password placeholder="••••••••" autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value: boolean) =>
                value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms')),
            },
          ]}
        >
          <Checkbox>
            I agree to the <span className="text-brand-600">Terms</span> and{' '}
            <span className="text-brand-600">Privacy Policy</span>
          </Checkbox>
        </Form.Item>

        <Button type="primary" size="large" block htmlType="submit" loading={status === 'loading'}>
          Create account
        </Button>
      </Form>
    </AuthCard>
  );
}
