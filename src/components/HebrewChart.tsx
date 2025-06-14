
import { NetWorthSummary } from '@/types/finance';

interface HebrewChartProps {
  summary: NetWorthSummary;
}

export const HebrewChart = ({ summary }: HebrewChartProps) => {
  const total = summary.totalAssets + summary.totalLiabilities;
  const assetsPercentage = total > 0 ? Math.round((summary.totalAssets / total) * 100) : 0;
  const liabilitiesPercentage = 100 - assetsPercentage;

  const formatCurrency = (amount: number) => {
    return `₪${amount.toLocaleString()}`;
  };

  return (
    <div className="frame-wrapper">
      <div className="chart-wrapper">
        <div className="chart">
          <div className="overlap-group">
            <div className="group">
              <div className="overlap-group-2">
                <div className="text-wrapper-4">התחייבויות</div>
                <div className="text-wrapper-5">{liabilitiesPercentage}%</div>
              </div>
            </div>
            <div className="ellipse"></div>
            <div className="overlap-wrapper">
              <div className="overlap-2">
                <svg className="img" width="158" height="140" viewBox="0 0 158 140">
                  <path
                    d="M 79 70 L 79 0 A 70 70 0 0 1 132 32 Z"
                    fill="#ff703b"
                    opacity="0.8"
                  />
                </svg>
                <svg className="ellipse-2" width="257" height="251" viewBox="0 0 257 251">
                  <circle
                    cx="128.5"
                    cy="125.5"
                    r="120"
                    fill="none"
                    stroke="#9ad960"
                    strokeWidth="15"
                    strokeDasharray={`${assetsPercentage * 7.54} ${(100 - assetsPercentage) * 7.54}`}
                    transform="rotate(-90 128.5 125.5)"
                  />
                </svg>
                <div className="text-wrapper-6">{formatCurrency(summary.netWorth)}</div>
              </div>
            </div>
          </div>
          <div className="group-2">
            <div className="text-wrapper-7">נכסים</div>
          </div>
          <div className="text-wrapper-8">{assetsPercentage}%</div>
        </div>
      </div>
    </div>
  );
};
