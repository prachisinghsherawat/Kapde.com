import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Radio, Select } from 'antd';
import { CreditCardOutlined, LockOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/auth/authSlice';
import { placeOrder, selectCartLines, selectCartTotals } from '@/features/cart/cartSlice';
import OrderSummary from '@/components/cart/OrderSummary';
import { formatPrice } from '@/lib/format';

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  method: 'card' | 'cod';
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

const STATES = [
  'Delhi',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

/** Card fields are formatted as the shopper types so the rules can stay simple. */
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

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
          <section className="surface-card p-6">
            <h2 className="mb-5 font-display text-lg font-semibold text-ink">Delivery address</h2>

            <div className="grid gap-x-4 sm:grid-cols-2">
              <Form.Item
                name="fullName"
                label="Full name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Priya Sharma" autoComplete="name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'That does not look like an email address' },
                ]}
              >
                <Input placeholder="you@example.com" autoComplete="email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  { pattern: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number' },
                ]}
              >
                <Input placeholder="9876543210" maxLength={10} autoComplete="tel" />
              </Form.Item>

              <Form.Item
                name="pincode"
                label="PIN code"
                rules={[
                  { required: true, message: 'Please enter your PIN code' },
                  { pattern: /^\d{6}$/, message: 'A PIN code is 6 digits' },
                ]}
              >
                <Input placeholder="560001" maxLength={6} autoComplete="postal-code" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                className="sm:col-span-2"
                rules={[{ required: true, message: 'Please enter your address' }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Flat, building, street"
                  autoComplete="street-address"
                />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter your city' }]}
              >
                <Input placeholder="Bengaluru" autoComplete="address-level2" />
              </Form.Item>

              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please choose your state' }]}
              >
                <Select
                  placeholder="Select state"
                  options={STATES.map((state) => ({ value: state, label: state }))}
                />
              </Form.Item>
            </div>
          </section>

          <section className="surface-card p-6">
            <h2 className="mb-5 font-display text-lg font-semibold text-ink">Payment</h2>

            <Form.Item name="method">
              <Radio.Group className="flex w-full flex-col gap-3 sm:flex-row">
                <Radio.Button value="card" className="flex-1 !h-auto !py-3 text-center">
                  <CreditCardOutlined className="mr-2" />
                  Card
                </Radio.Button>
                <Radio.Button value="cod" className="flex-1 !h-auto !py-3 text-center">
                  Cash on delivery
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {method === 'card' ? (
              <div className="grid gap-x-4 sm:grid-cols-2">
                <Form.Item
                  name="cardNumber"
                  label="Card number"
                  className="sm:col-span-2"
                  normalize={formatCardNumber}
                  rules={[
                    { required: true, message: 'Please enter your card number' },
                    {
                      pattern: /^(\d{4} ){3}\d{4}$/,
                      message: 'A card number is 16 digits',
                    },
                  ]}
                >
                  <Input placeholder="4242 4242 4242 4242" inputMode="numeric" />
                </Form.Item>

                <Form.Item
                  name="expiry"
                  label="Expiry (MM/YY)"
                  normalize={formatExpiry}
                  rules={[
                    { required: true, message: 'Please enter the expiry date' },
                    {
                      pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                      message: 'Use MM/YY',
                    },
                  ]}
                >
                  <Input placeholder="09/28" inputMode="numeric" />
                </Form.Item>

                <Form.Item
                  name="cvv"
                  label="CVV"
                  normalize={(value: string) => value.replace(/\D/g, '').slice(0, 3)}
                  rules={[
                    { required: true, message: 'Please enter the CVV' },
                    { pattern: /^\d{3}$/, message: 'A CVV is 3 digits' },
                  ]}
                >
                  <Input.Password placeholder="123" inputMode="numeric" />
                </Form.Item>
              </div>
            ) : (
              <p className="rounded-xl bg-subtle p-4 text-sm text-muted">
                Pay {formatPrice(totals.total)} in cash when your order arrives. Please keep exact
                change ready for the delivery partner.
              </p>
            )}

            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <LockOutlined />
              This is a demo storefront — no card is charged and no details leave your browser.
            </p>
          </section>
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
