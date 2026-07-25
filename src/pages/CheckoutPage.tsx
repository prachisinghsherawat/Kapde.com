import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Form } from 'antd';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/auth/authSlice';
import { placeOrder, selectCartLines, selectCartTotals } from '@/features/cart/cartSlice';
import OrderSummary from '@/components/cart/OrderSummary';
import AddressFields from '@/components/checkout/AddressFields';
import PaymentFields from '@/components/checkout/PaymentFields';
import type { CheckoutForm } from '@/lib/checkout';
import { formatPrice } from '@/lib/format';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm<CheckoutForm>();
  const user = useAppSelector(selectUser);
  const lines = useAppSelector(selectCartLines);
  const totals = useAppSelector(selectCartTotals);
  const [submitting, setSubmitting] = useState(false);
  const method = Form.useWatch('method', form) ?? 'card';

  if (lines.length === 0) return <Navigate to="/cart" replace />;

  const handleFinish = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    dispatch(placeOrder(totals));
    navigate('/order-confirmed', { replace: true });
  };

  return (
    <div className="container animate-fade-up py-8 lg:py-12">
      <h1 className="section-title mb-6">Checkout</h1>

      <Form<CheckoutForm>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ method: 'card', fullName: user?.name, email: user?.email }}
        onFinish={handleFinish}
        className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start"
      >
        <div className="space-y-6">
          <AddressFields />
          <PaymentFields method={method} total={totals.total} />
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummary
            totals={totals}
            action={
              <Button type="primary" size="large" block htmlType="submit" loading={submitting}>
                {method === 'cod' ? 'Place order' : `Pay ${formatPrice(totals.total)}`}
              </Button>
            }
          />
        </div>
      </Form>
    </div>
  );
}
