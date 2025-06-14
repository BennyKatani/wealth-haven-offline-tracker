
import { useState } from 'react';
import { Account } from '@/types/finance';
import { generateId } from '@/utils/calculations';
import { storageUtils } from '@/utils/storage';

interface HebrewAddAssetFormProps {
  onAccountAdded: () => void;
}

export const HebrewAddAssetForm = ({ onAccountAdded }: HebrewAddAssetFormProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (!name || !amount) return;

    const account: Account = {
      id: generateId(),
      name,
      type: 'other',
      balance: parseFloat(amount),
      isAsset: true,
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
    <div className="frame-10">
      <div className="frame-11">
        <div className="frame-12">
          <div className="text-wrapper-13">הוספת נכס חדש</div>
        </div>
        <div className="frame-13">
          <div className="frame-14">💰</div>
        </div>
      </div>
      <div className="frame-15">
        <div className="frame-16">
          <div className="frame-17">
            <input
              type="text"
              placeholder="שם הנכס"
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
          <button className="frame-19" onClick={handleSubmit}>
            <div className="text-wrapper-15">+ הוסף נכס</div>
          </button>
        </div>
      </div>
    </div>
  );
};
