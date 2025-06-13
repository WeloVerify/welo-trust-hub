
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Lock } from 'lucide-react';

interface AdminApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'approve' | 'reject';
  companyName: string;
  onConfirm: (reason?: string) => void;
  loading?: boolean;
}

const AdminApprovalDialog: React.FC<AdminApprovalDialogProps> = ({
  open,
  onOpenChange,
  type,
  companyName,
  onConfirm,
  loading = false
}) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = () => {
    if (type === 'reject' && !rejectionReason.trim()) {
      return; // Don't allow empty rejection reason
    }
    onConfirm(type === 'reject' ? rejectionReason : undefined);
    setRejectionReason('');
  };

  const handleClose = () => {
    setRejectionReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'approve' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {type === 'approve' ? 'Approve Company' : 'Reject Company'}
          </DialogTitle>
          <DialogDescription>
            {type === 'approve' ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Lock className="h-4 w-4" />
                Are you sure you want to approve <strong>{companyName}</strong>?
              </div>
            ) : (
              `You are about to reject ${companyName}. Please provide a reason.`
            )}
          </DialogDescription>
        </DialogHeader>

        {type === 'approve' && (
          <div className="py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Once approved:</strong>
              </p>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Company will receive approved status</li>
                <li>• Public Welo Page URL will be generated</li>
                <li>• Company dashboard access will be granted</li>
              </ul>
            </div>
          </div>
        )}

        {type === 'reject' && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for rejection <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Please provide a clear reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>This action will:</strong>
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                <li>• Mark the company as rejected</li>
                <li>• Send the rejection reason to the company</li>
                <li>• Restrict dashboard access</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || (type === 'reject' && !rejectionReason.trim())}
            className={
              type === 'approve'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }
          >
            {loading ? 'Processing...' : type === 'approve' ? 'Approve Company' : 'Reject Company'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminApprovalDialog;
