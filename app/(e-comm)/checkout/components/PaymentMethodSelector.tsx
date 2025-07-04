import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Banknote, Shield, CheckCircle } from "lucide-react";

export default function PaymentMethodSelector() {
    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    طريقة الدفع
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* COD - Primary Payment Method for Saudi Arabia */}
                <div className="p-4 border-2 border-green-500 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Banknote className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-700">الدفع عند الاستلام</h3>
                                <p className="text-sm text-green-600">طريقة الدفع الأكثر أمانًا</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <Badge className="bg-green-600 text-white">مُحدد</Badge>
                        </div>
                    </div>

                    <div className="text-sm text-green-700 space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>ادفع بالضبط عند وصول الطلب</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>فحص المنتجات قبل الدفع</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>لا توجد رسوم إضافية</span>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Payment Methods */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                        طرق دفع إضافية (قريبًا)
                    </div>

                    {/* Mada Card - Most Popular in Saudi Arabia */}
                    <div className="p-3 border border-muted rounded-lg bg-muted/20 opacity-75">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">بطاقة مدى</span>
                                    <Badge variant="outline" className="mr-2 text-xs">قريبًا</Badge>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">الأكثر استخداماً في السعودية</span>
                        </div>
                    </div>

                    {/* Apple Pay */}
                    <div className="p-3 border border-muted rounded-lg bg-muted/20 opacity-75">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                    <Wallet className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">Apple Pay</span>
                                    <Badge variant="outline" className="mr-2 text-xs">قريبًا</Badge>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">دفع سريع وآمن</span>
                        </div>
                    </div>

                    {/* Credit/Debit Cards */}
                    <div className="p-3 border border-muted rounded-lg bg-muted/20 opacity-75">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">البطاقات الائتمانية</span>
                                    <Badge variant="outline" className="mr-2 text-xs">قريبًا</Badge>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">Visa, Mastercard</span>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 pt-4 text-xs text-muted-foreground border-t">
                    <Shield className="h-4 w-4 text-feature-commerce" />
                    <span>جميع المدفوعات آمنة ومشفرة طبقاً لأعلى معايير الأمان</span>
                </div>
            </CardContent>
        </Card>
    );
} 