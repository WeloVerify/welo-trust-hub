
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AdminConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'approve' | 'reject';
  companyName: string;
  onConfirm: (reason?: string) => void;
  loading?: boolean;
}

const AdminConfirmDialog = ({ 
  open, 
  onOpenChange, 
  type, 
  companyName, 
  onConfirm, 
  loading = false 
}: AdminConfirmDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = () => {
    if (type === 'reject') {
      onConfirm(rejectionReason);
    } else {
      onConfirm();
    }
    setRejectionReason(''); // Reset for next use
  };

  const handleCancel = () => {
    setRejectionReason('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === 'approve' ? 'Approve Company' : 'Reject Company'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              {type === 'approve' ? (
                <p>
                  Are you sure you want to approve <strong>{companyName}</strong>?
                  <br />
                  <br />
                  This will:
                  <br />
                  • Move the company to approved status
                  <br />
                  • Generate their Welo Page link
                  <br />
                  • Grant access to dashboard features
                </p>
              ) : (
                <div className="space-y-3">
                  <p>
                    Please provide a reason for rejecting <strong>{companyName}</strong>:
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="rejection-reason">Rejection Reason</Label>
                    <Textarea
                      id="rejection-reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter the reason for rejection..."
                      rows={3}
                      className="resize-none"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading || (type === 'reject' && !rejectionReason.trim())}
            className={type === 'approve' ? 
              'bg-green-600 hover:bg-green-700' : 
              'bg-red-600 hover:bg-red-700'
            }
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{type === 'approve' ? 'Approving...' : 'Rejecting...'}</span>
              </div>
            ) : (
              type === 'approve' ? 'Approve Company' : 'Reject Company'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminConfirmDialog;
