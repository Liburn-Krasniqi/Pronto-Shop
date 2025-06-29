import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { apiClient } from '@/api/client';
import './GiftCardInput.css';

interface GiftCardInputProps {
  onGiftCardApplied: (amount: number, code: string) => void;
  orderTotal: number;
  disabled?: boolean;
}

interface GiftCardValidation {
  id: string;
  code: string;
  balance: number;
  amount: number;
}

export const GiftCardInput: React.FC<GiftCardInputProps> = ({
  onGiftCardApplied,
  orderTotal,
  disabled = false
}) => {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedGiftCard, setValidatedGiftCard] = useState<GiftCardValidation | null>(null);
  const [amountToUse, setAmountToUse] = useState(0);

  const handleValidateGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast.error('Please enter a gift card code');
      return;
    }

    setIsValidating(true);
    try {
      const response = await apiClient.post('/gift-cards/validate', {
        code: giftCardCode.trim()
      });

      setValidatedGiftCard(response);
      const maxAmount = Math.min(response.balance, orderTotal);
      setAmountToUse(maxAmount);
      
      toast.success('Gift card validated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid gift card code');
      setValidatedGiftCard(null);
      setAmountToUse(0);
    } finally {
      setIsValidating(false);
    }
  };

  const handleApplyGiftCard = () => {
    if (!validatedGiftCard || amountToUse <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    onGiftCardApplied(amountToUse, validatedGiftCard.code);
    setGiftCardCode('');
    setValidatedGiftCard(null);
    setAmountToUse(0);
  };

  const handleRemoveGiftCard = () => {
    setValidatedGiftCard(null);
    setAmountToUse(0);
  };

  return (
    <div className="gift-card-input">
      <h3>Gift Card</h3>
      
      {!validatedGiftCard ? (
        <div className="gift-card-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter gift card code"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
              disabled={disabled || isValidating}
              className="gift-card-code-input"
            />
            <button
              type="button"
              onClick={handleValidateGiftCard}
              disabled={disabled || isValidating || !giftCardCode.trim()}
              className="validate-button"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </button>
          </div>
        </div>
      ) : (
        <div className="gift-card-details">
          <div className="gift-card-info">
            <p><strong>Code:</strong> {validatedGiftCard.code}</p>
            <p><strong>Available Balance:</strong> ${validatedGiftCard.balance.toFixed(2)}</p>
            <p><strong>Order Total:</strong> ${orderTotal.toFixed(2)}</p>
          </div>
          
          <div className="amount-input">
            <label htmlFor="amountToUse">Amount to use:</label>
            <input
              type="number"
              id="amountToUse"
              min="0.01"
              max={Math.min(validatedGiftCard.balance, orderTotal)}
              step="0.01"
              value={amountToUse}
              onChange={(e) => setAmountToUse(parseFloat(e.target.value) || 0)}
              disabled={disabled}
              className="amount-input-field"
            />
          </div>
          
          <div className="gift-card-actions">
            <button
              type="button"
              onClick={handleApplyGiftCard}
              disabled={disabled || amountToUse <= 0}
              className="apply-button"
            >
              Apply ${amountToUse.toFixed(2)}
            </button>
            <button
              type="button"
              onClick={handleRemoveGiftCard}
              disabled={disabled}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 