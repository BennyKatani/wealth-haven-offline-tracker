
import { useState } from 'react';
import { Account } from '@/types/finance';
import { generateId } from '@/utils/calculations';
import { storageUtils } from '@/utils/storage';

interface HebrewAddLiabilityFormProps {
  onAccountAdded: () => void;
}

export const HebrewAddLiabilityForm = ({ onAccountAdded }: HebrewAddLiabilityFormProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (!name || !amount) return;

    const account: Account = {
      id: generateId(),
      name,
      type: 'other',
      balance: parseFloat(amount),
      isAsset: false,
      category: 'other',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageUtils.addAccount(account);
    onAccountAdded();
    setName('');
    setAmount('');
  };

  return (
    <div className="frame-20">
      <div className="frame-11">
        <div className="frame-12">
          <div className="text-wrapper-13">הוספת התחייבות חדשה</div>
        </div>
        <div className="frame-13">
          <div className="frame-21">💳</div>
        </div>
      </div>
      <div className="frame-15">
        <div className="frame-16">
          <div className="frame-17">
            <input
              type="text"
              placeholder="שם ההתחייבות"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-wrapper-14"
            />
          </div>
          <div className="frame-18">
            <input
              type="number"
              placeholder="שווי בשקלים"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-wrapper-14"
            />
          </div>
          <button className="frame-22" onClick={handleSubmit}>
            <div className="text-wrapper-15">+ הוסף התחייבות</div>
          </button>
        </div>
      </div>
    </div>
  );
};
