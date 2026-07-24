import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you were looking for has moved or never existed."
      extra={
        <Link to="/">
          <Button type="primary" size="large">
            Back to the store
          </Button>
        </Link>
      }
    />
  );
}
