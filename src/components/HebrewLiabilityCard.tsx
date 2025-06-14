
import { Account } from '@/types/finance';
import { Trash2 } from 'lucide-react';

interface HebrewLiabilityCardProps {
  account: Account;
  onDelete: (accountId: string) => void;
}

export const HebrewLiabilityCard = ({ account, onDelete }: HebrewLiabilityCardProps) => {
  const formatCurrency = (amount: number) => {
    return `₪${amount.toLocaleString()}`;
  };

  return (
    <div className="overlap-group-wrapper">
      <div className="overlap-group-3">
        <div style={{ position: 'absolute', left: '14px', top: '92px', fontSize: '20px' }}>
          💳
        </div>
        <button 
          onClick={() => onDelete(account.id)}
          style={{ 
            position: 'absolute', 
            left: '237px', 
            top: '92px', 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer',
            color: '#ff6932'
          }}
        >
          <Trash2 size={18} />
        </button>
        <div className="text-wrapper-11">{account.name}</div>
        <div className="text-wrapper-12">{formatCurrency(account.balance)}</div>
      </div>
    </div>
  );
};
