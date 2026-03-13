# Gymsdata Checkout – Return URLs

When creating the Stripe Checkout session in **POST /api/v1/gymsdata/checkout**, the backend should set:

- **success_url**: Where to redirect after successful payment.  
  Frontend route: `/checkout/success`  
  Stripe will append `?session_id={CHECKOUT_SESSION_ID}`.  
  Full URL example: `{FRONTEND_ORIGIN}/checkout/success?session_id=cs_xxx`

- **cancel_url**: Where to redirect if the user cancels or leaves the Stripe Checkout page.  
  Frontend route: `/checkout/cancel`  
  Full URL example: `{FRONTEND_ORIGIN}/checkout/cancel`

Build these using the same frontend base URL (e.g. `NEXT_PUBLIC_SITE_URL` or your app origin).
