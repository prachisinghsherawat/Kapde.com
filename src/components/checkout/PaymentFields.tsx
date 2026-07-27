import { Form, Input, Radio } from 'antd';

import Icon from '@/lib/icons';
import { formatCardNumber, formatCvv, formatExpiry } from '@/lib/checkout';
import { formatPrice } from '@/lib/format';

export default function PaymentFields({ method, total }: { method: 'card' | 'cod'; total: number }) {
  return (
    <section className="surface-card p-6">
      <h2 className="mb-5 font-display text-lg font-semibold text-ink">Payment</h2>

      <Form.Item name="method">
        <Radio.Group className="flex w-full flex-col gap-3 sm:flex-row">
          <Radio.Button value="card" className="flex-1 !h-auto !py-3 text-center">
            <Icon name="card" size="md" className="mr-2" />
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
              { pattern: /^(\d{4} ){3}\d{4}$/, message: 'A card number is 16 digits' },
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
              { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY' },
            ]}
          >
            <Input placeholder="09/28" inputMode="numeric" />
          </Form.Item>

          <Form.Item
            name="cvv"
            label="CVV"
            normalize={formatCvv}
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
          Pay {formatPrice(total)} in cash when your order arrives. Please keep exact change ready
          for the delivery partner.
        </p>
      )}

      <p className="mt-2 flex items-center gap-2 text-xs text-muted">
        <Icon name="lock" size="sm" />
        This is a demo storefront — no card is charged and no details leave your browser.
      </p>
    </section>
  );
}
