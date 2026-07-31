import { useState } from 'react';
import { App, Button, Form, Input } from 'antd';

import Icon from '@/lib/icons';

interface SignupValues {
  email: string;
}

/**
 * There is no mailing-list backend behind this, so the form owns its own "done"
 * state rather than pretending to be a request: it validates the address, thanks
 * you, and stays thanked. Swapping in a real POST means filling in `onFinish`.
 */
export default function Newsletter() {
  const { message } = App.useApp();
  const [form] = Form.useForm<SignupValues>();
  const [subscribed, setSubscribed] = useState(false);

  const onFinish = ({ email }: SignupValues) => {
    setSubscribed(true);
    form.resetFields();
    message.success(`You're on the list — we'll write to ${email}.`);
  };

  return (
    <section className="container pb-14">
      <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 text-white sm:px-12">
        {/* Two soft blooms instead of a photograph: nothing to fail to load, and no
            contrast risk for the copy sitting on top. */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-brand-800/40 blur-3xl" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Icon name="subscribe" size="sm" />
              Newsletter
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Get the drop first
            </h2>
            <p className="mt-3 text-sm text-white/80 sm:text-base">
              New arrivals, restocks and members-only markdowns — one email a week, and
              10% off your first order.
            </p>
          </div>

          <div className="w-full max-w-md lg:w-auto lg:min-w-[22rem]">
            {subscribed ? (
              <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/15 px-5 py-4 text-sm font-medium lg:justify-start">
                <Icon name="inStock" size="xl" />
                Thanks — your first email is on its way.
              </div>
            ) : (
              <Form form={form} onFinish={onFinish} requiredMark={false} className="!mb-0">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Form.Item
                    name="email"
                    className="!mb-0 flex-1"
                    rules={[
                      { required: true, message: 'Enter an email address' },
                      { type: 'email', message: "That doesn't look like an email" },
                    ]}
                  >
                    <Input
                      size="large"
                      type="email"
                      placeholder="you@example.com"
                      aria-label="Email address"
                      prefix={<Icon name="mail" className="text-muted" />}
                    />
                  </Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    icon={<Icon name="arrowRight" />}
                    iconPosition="end"
                    className="!h-10 !border-0 !bg-white !px-6 !font-semibold !text-brand-700 hover:!bg-white/90"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="mt-3 text-xs text-white/70">
                  No spam. Unsubscribe in one click, any time.
                </p>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
