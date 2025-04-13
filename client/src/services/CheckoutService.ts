import axios from 'axios';
import { cartService } from './CartService';

interface CheckoutData {
  email: string;
  isGuest: boolean;
  newsletter: boolean;
  shippingAddress: any;
  billingAddress: any;
  sameAsBilling: boolean;
  shippingMethod: string;
  items: any[];
  payment: {
    method: string;
    cardLastFour?: string;
    cardBrand?: string;
    paypalEmail?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

class CheckoutService {
  private readonly API_URL = '/api/checkout';

  async createOrder(checkoutData: CheckoutData) {
    try {
      const response = await axios.post(this.API_URL, checkoutData);
      if (response.data) {
        // Clear the cart after successful order
        cartService.clearCart();
      }
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderStatus(orderId: string) {
    try {
      const response = await axios.get(`${this.API_URL}/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  }

  calculateTax(subtotal: number): number {
    return subtotal * 0.085; // 8.5% tax rate
  }

  getShippingCost(method: string): number {
    switch (method.toLowerCase()) {
      case 'standard':
        return 4.99;
      case 'express':
        return 9.99;
      case 'next-day':
        return 14.99;
      default:
        return 4.99;
    }
  }
}

export const checkoutService = new CheckoutService(); 