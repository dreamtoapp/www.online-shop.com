'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icon } from '@/components/icons/Icon';
import { otpViaWhatsApp, verifyTheUser, resendOTP } from '@/app/(e-comm)/auth/verify/action/otp-via-whatsapp';

export default function WhatsAppOTPExample() {
    const [otpCode, setOtpCode] = useState('');
    const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [canResend, setCanResend] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await otpViaWhatsApp();

            if (result.success) {
                setStep('otp');
                setSuccess('تم إرسال رمز التحقق عبر WhatsApp');
                setCanResend(false);
                startResendCountdown();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('حدث خطأ أثناء إرسال رمز التحقق');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpCode.trim()) {
            setError('يرجى إدخال رمز التحقق');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await verifyTheUser(otpCode);

            if (result.success) {
                setStep('success');
                setSuccess('تم التحقق من الحساب بنجاح!');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('حدث خطأ أثناء التحقق من الرمز');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await resendOTP();

            if (result.success) {
                setSuccess('تم إعادة إرسال رمز التحقق');
                setCanResend(false);
                startResendCountdown();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('حدث خطأ أثناء إعادة إرسال الرمز');
        } finally {
            setLoading(false);
        }
    };

    const startResendCountdown = () => {
        setResendCountdown(120); // 2 minutes
        const interval = setInterval(() => {
            setResendCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const resetForm = () => {
        setOtpCode('');
        setStep('phone');
        setError('');
        setSuccess('');
        setCanResend(false);
        setResendCountdown(0);
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <Card className="shadow-lg border-l-4 border-l-feature-users">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Icon name="Shield" size="sm" className="text-feature-users icon-enhanced" />
                        التحقق عبر WhatsApp
                    </CardTitle>
                    <CardDescription>
                        سيتم إرسال رمز التحقق إلى رقم هاتفك عبر WhatsApp
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {step === 'phone' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    سيتم إرسال رمز التحقق إلى رقم الهاتف المسجل في حسابك
                                </p>
                            </div>

                            <Button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="w-full btn-add"
                            >
                                {loading ? (
                                    <>
                                        <Icon name="Loader2" size="sm" animation="spin" className="mr-2" />
                                        جاري الإرسال...
                                    </>
                                ) : (
                                    'إرسال رمز التحقق'
                                )}
                            </Button>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="otp" className="text-sm font-medium">
                                    رمز التحقق
                                </label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="1234"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
                                    disabled={loading}
                                    className="text-center text-lg tracking-widest"
                                />
                                <p className="text-xs text-muted-foreground">
                                    تم إرسال رمز مكون من 4 أرقام إلى رقم هاتفك
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleVerifyOTP}
                                    disabled={loading || !otpCode.trim()}
                                    className="flex-1 btn-save"
                                >
                                    {loading ? (
                                        <>
                                            <Icon name="Loader2" size="sm" animation="spin" className="mr-2" />
                                            جاري التحقق...
                                        </>
                                    ) : (
                                        'تحقق'
                                    )}
                                </Button>

                                <Button
                                    onClick={handleResendOTP}
                                    disabled={loading || !canResend}
                                    variant="outline"
                                    className="btn-view-outline"
                                >
                                    {loading ? (
                                        <Icon name="Loader2" size="sm" animation="spin" />
                                    ) : canResend ? (
                                        <Icon name="RefreshCw" size="sm" />
                                    ) : (
                                        formatCountdown(resendCountdown)
                                    )}
                                </Button>
                            </div>

                            <Button
                                onClick={resetForm}
                                variant="ghost"
                                className="w-full btn-cancel-outline"
                            >
                                تغيير رقم الهاتف
                            </Button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Icon name="Shield" size="lg" className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-600">
                                    تم التحقق بنجاح!
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    يمكنك الآن استخدام حسابك
                                </p>
                            </div>
                            <Button
                                onClick={resetForm}
                                className="w-full btn-add"
                            >
                                تحقق من رقم آخر
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 