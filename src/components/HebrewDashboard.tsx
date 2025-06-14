
import { useState } from 'react';
import { Account, NetWorthSummary } from '@/types/finance';
import { HebrewChart } from './HebrewChart';
import { HebrewAssetCard } from './HebrewAssetCard';
import { HebrewLiabilityCard } from './HebrewLiabilityCard';
import { HebrewAddAssetForm } from './HebrewAddAssetForm';
import { HebrewAddLiabilityForm } from './HebrewAddLiabilityForm';
import './hebrew-dashboard.css';

interface HebrewDashboardProps {
  accounts: Account[];
  summary: NetWorthSummary;
  onAccountAdded: () => void;
  onAccountDeleted: (accountId: string) => void;
}

export const HebrewDashboard = ({ accounts, summary, onAccountAdded, onAccountDeleted }: HebrewDashboardProps) => {
  const assets = accounts.filter(acc => acc.isAsset);
  const liabilities = accounts.filter(acc => !acc.isAsset);

  const formatCurrency = (amount: number) => {
    return `₪${amount.toLocaleString()}`;
  };

  return (
    <div className="dashboard">
      <div className="div">
        <div className="overlap">
          <div className="frame">
            {/* Header */}
            <div className="frame-2">
              <div className="text-wrapper">וולקאם באק</div>
              <div className="text-wrapper-2">👨🏽‍🦲</div>
              <div className="text-wrapper">היי קובי</div>
            </div>

            {/* Summary Cards */}
            <div className="frame-3">
              <div className="frame-4">
                <div className="rectangle"></div>
                <div className="frame-5">
                  <div className="text-wrapper-3">סך כל ההתחייבויות שלי</div>
                  <div className="element-wrapper">
                    <div className="element">{formatCurrency(summary.totalLiabilities)}</div>
                  </div>
                </div>
              </div>
              <div className="frame-4">
                <div className="rectangle-2"></div>
                <div className="frame-6">
                  <div className="text-wrapper-3">סך כל הנכסים שלי</div>
                  <div className="div-wrapper">
                    <div className="element-2">{formatCurrency(summary.totalAssets)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <HebrewChart summary={summary} />

            {/* Assets List */}
            <div className="frame-7">
              {assets.slice(0, 3).map((asset) => (
                <HebrewAssetCard 
                  key={asset.id} 
                  account={asset} 
                  onDelete={onAccountDeleted}
                />
              ))}
            </div>

            {/* Liabilities List */}
            <div className="frame-8">
              <div className="frame-9">
                {liabilities.slice(0, 2).map((liability) => (
                  <HebrewLiabilityCard 
                    key={liability.id} 
                    account={liability} 
                    onDelete={onAccountDeleted}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Asset Form */}
        <HebrewAddAssetForm onAccountAdded={onAccountAdded} />

        {/* Add Liability Form */}
        <HebrewAddLiabilityForm onAccountAdded={onAccountAdded} />
      </div>
    </div>
  );
};
