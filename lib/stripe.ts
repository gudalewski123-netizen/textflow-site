import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'TextFlow AI',
    version: '0.1.0'
  }
});

// TextFlow AI Products & Prices
export const TEXTFLOW_PRODUCTS = {
  MONTHLY_SUBSCRIPTION: {
    name: 'TextFlow AI Platform',
    description: 'Monthly access to AI sales agent platform',
    price: 12500, // $125 in cents
    interval: 'month'
  },
  CREDIT_PACKS: [
    { id: 'credits_50', name: '$50 Credits', amount: 5000, smsCount: 4762 },
    { id: 'credits_100', name: '$100 Credits', amount: 10000, smsCount: 9524 },
    { id: 'credits_250', name: '$250 Credits', amount: 25000, smsCount: 23810 }
  ],
  SMS_PRICE: 0.0189 // $0.0189 per SMS (Twilio cost ~$0.0075 = 60% margin)
} as const;

// Create Stripe customer for a user
export async function createStripeCustomer(email: string, name?: string) {
  return stripe.customers.create({
    email,
    name,
    metadata: {
      product: 'TextFlow AI'
    }
  });
}

// Create monthly subscription
export async function createSubscription(customerId: string) {
  // In production, you'd create a Product and Price in Stripe dashboard first
  // For now, we'll create a simple subscription
  return stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: 'price_mock_monthly_subscription', // Will be replaced with real price ID
      }
    ],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  });
}

// Purchase credits
export async function purchaseCredits(customerId: string, amount: number) {
  return stripe.paymentIntents.create({
    customer: customerId,
    amount,
    currency: 'usd',
    description: `TextFlow AI Credits - $${(amount / 100).toFixed(2)}`,
    metadata: {
      type: 'credits',
      smsCount: Math.floor(amount / 0.0105 * 100) // $0.0105 per SMS
    }
  });
}

// Get customer's active subscription
export async function getCustomerSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1
  });
  
  return subscriptions.data[0] || null;
}