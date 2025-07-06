import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddressListDialog from "./client/AddressListDialog";
import { Address as PrismaAddress } from "@prisma/client";

export type AddressWithDefault = PrismaAddress & { isDefault?: boolean };

interface AddressBookProps {
    addresses: AddressWithDefault[];
}

export default function AddressBook({ addresses }: AddressBookProps) {
    // Safe check for undefined addresses
    const safeAddresses = addresses || [];
    const defaultAddress = safeAddresses.find(addr => addr.isDefault) || safeAddresses[0];

    if (!safeAddresses || safeAddresses.length === 0) {
        return (
            <Card className="shadow-lg border-l-4 border-l-orange-500">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        عنوان التوصيل
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">لم يتم إضافة عنوان بعد</p>
                        <p className="text-sm text-orange-600 mb-4">
                            يجب إضافة عنوان للتوصيل قبل المتابعة في عملية الشراء
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={() => window.location.href = '/user/addresses?redirect=/checkout'}
                                className="w-full bg-feature-suppliers hover:bg-feature-suppliers/90 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                إضافة عنوان جديد
                            </button>
                            <div className="text-sm text-muted-foreground">أو</div>
                            <AddressListDialog addresses={[]} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    عنوان التوصيل
                    {defaultAddress && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Default Address Display */}
                {defaultAddress && (
                    <div className="p-4 bg-feature-commerce-soft rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-feature-commerce">
                                {defaultAddress.label || 'العنوان الافتراضي'}
                            </h4>
                            <Badge className="bg-feature-commerce text-white">
                                افتراضي
                            </Badge>
                        </div>

                        <div className="space-y-1 text-sm">
                            <div className="font-medium">{defaultAddress.district}</div>
                            <div>{defaultAddress.street}, مبنى {defaultAddress.buildingNumber}</div>
                            {defaultAddress.floor && <div>دور: {defaultAddress.floor}</div>}
                            {defaultAddress.apartmentNumber && <div>شقة: {defaultAddress.apartmentNumber}</div>}
                            {defaultAddress.landmark && (
                                <div className="text-feature-commerce">
                                    📍 {defaultAddress.landmark}
                                </div>
                            )}
                        </div>

                        {/* Location Status */}
                        <div className="mt-3">
                            {defaultAddress.latitude && defaultAddress.longitude ? (
                                <Badge variant="outline" className="border-green-600 text-green-700">
                                    ✅ موقع محدد
                                </Badge>
                            ) : (
                                <div className="space-y-2">
                                    <Badge variant="outline" className="border-red-600 text-red-700 bg-red-50">
                                        🚫 موقع مطلوب للتوصيل
                                    </Badge>
                                    <p className="text-xs text-red-600">
                                        يجب تحديد موقع دقيق لهذا العنوان قبل المتابعة في عملية الشراء
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Address Management */}
                <AddressListDialog addresses={safeAddresses} />
            </CardContent>
        </Card>
    );
} 