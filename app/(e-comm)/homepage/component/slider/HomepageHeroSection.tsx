import { getPromotions } from '../../actions/getPromotions';
import dynamic from 'next/dynamic';

const HomepageHeroSlider = dynamic(() => import('./HomepageHeroSlider'), { ssr: true });

export default async function HomepageHeroSection() {
    const promotions = await getPromotions();
    const heroSlides = promotions.map(promo => ({
        id: promo.id,
        header: promo.header ?? undefined,
        subheader: promo.subheader ?? undefined,
        discountPercentage: promo.discountPercentage ?? undefined,
        imageUrl: promo.imageUrl || '/fallback/fallback.avif',
        ctaText: 'Shop Now',
        ctaLink: '/categories',
        isActive: promo.isActive,
    }));

    return (
        <section className="relative -mx-4 sm:-mx-6 lg:-mx-8" aria-label="Hero banner">
            <HomepageHeroSlider slides={heroSlides} />
        </section>
    );
} 