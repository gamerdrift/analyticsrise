/**
 * Client-side loader for the official Razorpay Checkout SDK (checkout.js)
 *
 * Ensures safe dynamic injection, duplicate prevention, and clean error handling
 * without exposing private secrets or failing during Next.js static builds.
 */

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
const RAZORPAY_SCRIPT_ID = 'razorpay-checkout-sdk';

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler?: (response: RazorpayPaymentSuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    confirm_close?: boolean;
  };
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: any) => void) => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

/**
 * Loads the Razorpay checkout.js SDK dynamically in the browser.
 * Safe for Next.js static export / SSR.
 */
export function loadRazorpaySdk(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    // 1. Check if SDK is already loaded and available on window
    if (typeof window.Razorpay === 'function') {
      return resolve(true);
    }

    // 2. Check if script tag is already present in DOM
    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (typeof window.Razorpay === 'function') {
        return resolve(true);
      }
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () =>
        reject(
          new Error(
            'Failed to load Razorpay payment gateway. Please check your internet connection or disable ad-blockers.'
          )
        )
      );
      return;
    }

    // 3. Inject new script tag
    try {
      const script = document.createElement('script');
      script.id = RAZORPAY_SCRIPT_ID;
      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;

      script.onload = () => {
        if (typeof window.Razorpay === 'function') {
          resolve(true);
        } else {
          reject(new Error('Razorpay SDK loaded but constructor is not available on window.'));
        }
      };

      script.onerror = () => {
        // Remove failed script tag so retrying works
        script.remove();
        reject(
          new Error(
            'Failed to connect to Razorpay payment gateway. Please verify network access or disable script blockers.'
          )
        );
      };

      document.body.appendChild(script);
    } catch (err: any) {
      reject(new Error(err.message || 'Failed to inject Razorpay script.'));
    }
  });
}
