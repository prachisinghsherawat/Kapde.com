import { Form, Input, Select } from 'antd';

import { INDIAN_STATES } from '@/lib/checkout';

export default function AddressFields() {
  return (
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
          <Input.TextArea rows={2} placeholder="Flat, building, street" autoComplete="street-address" />
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
            options={INDIAN_STATES.map((state) => ({ value: state, label: state }))}
          />
        </Form.Item>
      </div>
    </section>
  );
}
