interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

class CartService {
  private readonly CART_KEY = 'pronto_shop_cart';

  private notifyCartUpdated() {
    window.dispatchEvent(new Event('cartUpdated'));
  }

  getCart(): CartItem[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(item: CartItem): void {
    const cart = this.getCart();
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    this.notifyCartUpdated();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      this.notifyCartUpdated();
    }
  }

  removeItem(itemId: string): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(i => i.id !== itemId);
    localStorage.setItem(this.CART_KEY, JSON.stringify(updatedCart));
    this.notifyCartUpdated();
  }

  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    this.notifyCartUpdated();
  }

  getTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
}

export const cartService = new CartService(); 