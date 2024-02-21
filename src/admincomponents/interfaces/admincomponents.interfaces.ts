/**
 * two factory authentication config object
 */
export interface AdminConfig2FAI {
    twoFactorAuthMethod: 'sms' | 'one_time_password' | 'email' | 'user_defined';
    trustDeviceDays: string;
    smsMailboxId: string;
    emailMailboxId: string;
    requireOn: 'always' | 'device_change' | '';
}