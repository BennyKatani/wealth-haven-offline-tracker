
import { Shield, Lock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const PrivacyBanner = () => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50 mb-8">
      <CardContent className="py-6">
        <div className="flex items-center justify-center space-x-8 text-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold text-sm">100% Private</div>
              <div className="text-xs text-muted-foreground">Data never leaves your device</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Lock className="h-6 w-6 text-success" />
            <div>
              <div className="font-semibold text-sm">No Accounts</div>
              <div className="text-xs text-muted-foreground">No registration required</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Eye className="h-6 w-6 text-warning" />
            <div>
              <div className="font-semibold text-sm">Offline First</div>
              <div className="text-xs text-muted-foreground">Works without internet</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
