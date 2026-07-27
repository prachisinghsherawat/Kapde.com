import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Button, Checkbox, Form, Input } from 'antd';

import Icon from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  login,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '@/features/auth/authSlice';
import AuthCard from '@/components/auth/AuthCard';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  // RequireAuth stashes the page the shopper was trying to reach.
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={{ text: 'New to Kapde?', linkLabel: 'Create an account', to: '/signup' }}
    >
      {error && <Alert type="error" message={error} showIcon className="mb-5" />}

      <Form<LoginForm>
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => void dispatch(login({ email: values.email }))}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'That does not look like an email address' },
          ]}
        >
          <Input
            prefix={<Icon name="mail" className="text-muted" />}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Passwords are at least 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<Icon name="lock" className="text-muted" />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <div className="mb-5 flex items-center justify-between">
          <Checkbox defaultChecked>Keep me signed in</Checkbox>
          <span className="text-sm text-brand-600">Forgot password?</span>
        </div>

        <Button type="primary" size="large" block htmlType="submit" loading={status === 'loading'}>
          Sign in
        </Button>
      </Form>
    </AuthCard>
  );
}
