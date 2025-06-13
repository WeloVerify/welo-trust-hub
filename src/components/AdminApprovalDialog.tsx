
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AdminApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'approve' | 'reject';
  companyName: string;
  onConfirm: (reason?: string) => void;
  loading: boolean;
}

const AdminApprovalDialog = ({ open, onOpenChange, type, companyName, onConfirm, loading }: AdminApprovalDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = () => {
    if (type === 'reject' && !rejectionReason.trim()) {
      return;
    }
    onConfirm(type === 'reject' ? rejectionReason : undefined);
    setRejectionReason('');
  };

  const handleCancel = () => {
    setRejectionReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'approve' ? 'Approve Company' : 'Reject Company'}
          </DialogTitle>
          <DialogDescription>
            {type === 'approve' 
              ? `Are you sure you want to approve "${companyName}"? This will generate their Welo badge and activate their account.`
              : `Please provide a reason for rejecting "${companyName}". This will be shown to the company.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {type === 'reject' && (
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason *</Label>
            <Textarea
              id="reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain why this company is being rejected..."
              className="min-h-[100px]"
              required
            />
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || (type === 'reject' && !rejectionReason.trim())}
            className={type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {loading ? 'Processing...' : type === 'approve' ? 'Approve Company' : 'Reject Company'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminApprovalDialog;
