import { toast } from 'sonner';

export const SMSService = {
  /**
   * Simulates sending a transaction notification SMS.
   * In a real app, this would call an SMS gateway API (e.g., Twilio).
   */
  sendTransactionNotification: (phoneNumber, { type, amount, recipient, balance }) => {
    let message;
    switch (type) {
      case 'sent':
        message = `Byte Finance: You sent R${amount.toFixed(2)} to ${recipient}. Your new balance is R${balance.toFixed(2)}.`;
        break;
      case 'deposit':
        message = `Byte Finance: You received a deposit of R${amount.toFixed(2)}. Your new balance is R${balance.toFixed(2)}.`;
        break;
      default:
        message = `Byte Finance: A transaction of R${amount.toFixed(2)} has occurred. Your new balance is R${balance.toFixed(2)}.`;
    }

    console.log(`[SMS SIMULATION] To: ${phoneNumber}, Message: "${message}"`);
    
    toast.info('📱 SMS Notification Sent', {
      description: 'A confirmation has been sent to your phone.',
    });
    
    // Return a promise to mimic async API call
    return Promise.resolve({ status: 'sent', sid: `SM_FAKE_${Date.now()}` });
  },

  /**
   * Simulates sending a Mobile Money PIN prompt (STK/USSD push).
   */
  sendMoMoPinPrompt: (phoneNumber, amount) => {
    const message = `A payment of R${amount} on Byte Finance requires your approval. Please enter your Mobile Money PIN when prompted.`;
    
    console.log(`[MOMO SIMULATION] To: ${phoneNumber}, Message: "${message}"`);
    
    toast.info('📱 Check Your Phone', {
      description: `Approve the R${amount} payment by entering your PIN.`,
      duration: 6000,
    });
    
    return Promise.resolve({ status: 'initiated' });
  },
};