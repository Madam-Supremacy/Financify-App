import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanFace, CheckCircle } from 'lucide-react';

export default function BiometricConfirmation({ isOpen, onConfirm, onCancel, amount }) {
    const [isScanning, setIsScanning] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setIsScanning(true);
            setIsConfirmed(false);
            
            // Simulate a scan
            const scanTimer = setTimeout(() => {
                setIsScanning(false);
                setIsConfirmed(true);
            }, 2500); // 2.5 second scan simulation

            return () => clearTimeout(scanTimer);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">Confirm Payment</DialogTitle>
                    <DialogDescription className="text-center">
                        Use biometrics to confirm your payment of <span className="font-bold text-gray-800">R{amount?.toFixed(2) || '0.00'}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center my-8 h-48">
                    {isScanning && (
                        <>
                            <div className="relative w-40 h-40">
                                <ScanFace className="w-40 h-40 text-blue-500" />
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                            </div>
                            <p className="mt-4 text-lg font-medium text-blue-600 animate-pulse">Scanning...</p>
                        </>
                    )}
                    {!isScanning && isConfirmed && (
                         <>
                            <CheckCircle className="w-40 h-40 text-green-500" />
                            <p className="mt-4 text-lg font-medium text-green-600">Verified</p>
                        </>
                    )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!isConfirmed}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                        {isConfirmed ? 'Complete Payment' : 'Verifying...'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}