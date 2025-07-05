// 'use client'; // REMOVE THIS LINE to make the component a server component

import Link from 'next/link';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Award,
  Truck,
  ShoppingBag,
  Users,
  Heart,
  Star,
  CreditCard,
  Headphones,
  Globe,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import NewsletterClientWrapper from './NewsletterClientWrapper';

interface FooterProps {
  aboutus?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

// Company Information Component (65 lines)
function CompanyInfo({ aboutus, companyName }: { aboutus?: string; companyName?: string }) {
  return (
    <div className="space-y-6">
      {/* Logo and Company Name */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-feature-commerce flex items-center justify-center">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{companyName || 'Dream To App'}</h2>
          <p className="text-sm text-feature-commerce font-medium">شركة رائدة في التجارة الإلكترونية</p>
        </div>
      </div>

      {/* Company Description */}
      <p className="text-muted-foreground leading-relaxed">
        {aboutus || 'نحن شركة متخصصة في تقديم أفضل المنتجات والخدمات لعملائنا الكرام، مع التزامنا بأعلى معايير الجودة والتميز في خدمة العملاء.'}
      </p>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-feature-products/10 text-feature-products border-feature-products/20">
          <Shield className="h-3 w-3 ml-1" />
          آمن ومضمون
        </Badge>
        <Badge variant="secondary" className="bg-feature-commerce/10 text-feature-commerce border-feature-commerce/20">
          <Award className="h-3 w-3 ml-1" />
          جودة مضمونة
        </Badge>
        <Badge variant="secondary" className="bg-feature-analytics/10 text-feature-analytics border-feature-analytics/20">
          <Truck className="h-3 w-3 ml-1" />
          توصيل سريع
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-feature-commerce">1000+</div>
          <div className="text-xs text-muted-foreground">منتج</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-feature-users">5000+</div>
          <div className="text-xs text-muted-foreground">عميل راضي</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-feature-products">24/7</div>
          <div className="text-xs text-muted-foreground">دعم فني</div>
        </div>
      </div>
    </div>
  );
}

// Services Section Component (45 lines)
function ServicesSection() {
  const services = [
    { name: 'المتجر الإلكتروني', href: '/', icon: ShoppingBag },
    { name: 'من نحن', href: '/about', icon: Users },
    { name: 'تواصل معنا', href: '/contact', icon: Phone },
    { name: 'المفضلة', href: '/user/wishlist', icon: Heart },
    { name: 'التقييمات', href: '/user/ratings', icon: Star },
    { name: 'الطلبات', href: '/user/purchase-history', icon: CreditCard },
  ];

  const customerService = [
    { name: 'الدعم الفني', href: '/support', icon: Headphones },
    { name: 'شروط الاستخدام', href: '/terms', icon: Shield },
    { name: 'سياسة الخصوصية', href: '/privacy', icon: CheckCircle },
    { name: 'سياسة الإرجاع', href: '/returns', icon: Truck },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-feature-commerce" />
          خدماتنا
        </h3>
        <ul className="space-y-3">
          {services.map((service) => (
            <li key={service.name}>
              <Link
                href={service.href}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <service.icon className="h-4 w-4 text-feature-commerce group-hover:text-feature-commerce/80 transition-colors" />
                <span className="text-sm">{service.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Headphones className="h-5 w-5 text-feature-users" />
          خدمة العملاء
        </h3>
        <ul className="space-y-3">
          {customerService.map((service) => (
            <li key={service.name}>
              <Link
                href={service.href}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <service.icon className="h-4 w-4 text-feature-users group-hover:text-feature-users/80 transition-colors" />
                <span className="text-sm">{service.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Enhanced Contact Component (50 lines)
function EnhancedContact({
  email,
  phone,
  address,
  facebook,
  instagram,
  twitter,
  linkedin
}: {
  email?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-feature-settings" />
        تواصل معنا
      </h3>

      <div className="space-y-4">
        {email && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-feature-settings/10 flex items-center justify-center">
              <Mail className="h-4 w-4 text-feature-settings" />
            </div>
            <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {email}
            </a>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-feature-settings/10 flex items-center justify-center">
              <Phone className="h-4 w-4 text-feature-settings" />
            </div>
            <a href={`tel:${phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {phone}
            </a>
          </div>
        )}

        {address && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-feature-settings/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-feature-settings" />
            </div>
            <span className="text-sm text-muted-foreground">{address}</span>
          </div>
        )}

        <div className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-full bg-feature-settings/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-feature-settings" />
          </div>
          <span className="text-sm text-muted-foreground">متوفرون 24/7 لخدمتكم</span>
        </div>
      </div>

      {/* Client Social Media */}
      {(facebook || instagram || twitter || linkedin) && (
        <div className="pt-4 border-t border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-3">تابعونا</h4>
          <div className="flex items-center gap-3">
            {facebook && (
              <a
                href={facebook}
                className="h-9 w-9 rounded-full bg-feature-users/10 flex items-center justify-center text-feature-users hover:bg-feature-users hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                className="h-9 w-9 rounded-full bg-feature-users/10 flex items-center justify-center text-feature-users hover:bg-feature-users hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                className="h-9 w-9 rounded-full bg-feature-users/10 flex items-center justify-center text-feature-users hover:bg-feature-users hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                className="h-9 w-9 rounded-full bg-feature-users/10 flex items-center justify-center text-feature-users hover:bg-feature-users hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Footer Component (60 lines)
const Footer = ({
  aboutus,
  email,
  phone,
  address,
  facebook,
  instagram,
  twitter,
  linkedin,
  companyName,
}: FooterProps) => {
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Info - Takes up more space */}
          <div className="lg:col-span-4">
            <CompanyInfo aboutus={aboutus} companyName={companyName} />
          </div>

          {/* Services - Takes up more space */}
          <div className="lg:col-span-5">
            <ServicesSection />
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-3 space-y-8">
            <EnhancedContact
              email={email}
              phone={phone}
              address={address}
              facebook={facebook}
              instagram={instagram}
              twitter={twitter}
              linkedin={linkedin}
            />
            <NewsletterClientWrapper />
          </div>
        </div>
      </div>

      <Separator className="mx-4 sm:mx-6 lg:mx-8" />

      {/* Bottom Footer - Developer Area */}
      <div className="bg-muted/30 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              © 2024 Dream To App. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
