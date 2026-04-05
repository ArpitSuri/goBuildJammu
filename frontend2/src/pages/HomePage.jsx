import { Helmet } from 'react-helmet-async';
import BestDeals from "../../components/BestDeals";
import { CategoriesSection } from "../../components/categorySectoin";
import { HeroSection } from "../../components/Header";
import HeroStack from "../../components/HeroStack";

export default function Home() {
  const siteUrl = "https://www.digitalinfratech.in";

  return (
    <div>
      <Helmet>
        {/* Standard SEO with Local Focus */}
        <title>Digital Infratech | Building Materials & Home Accessories in Lucknow</title>
        <meta name="description" content="Digital Infratech offers premium building materials, construction equipment, and home accessories in Lucknow. Get cement, steel, and hardware delivered to your doorstep." />
        <link rel="canonical" href={siteUrl} />

        {/* Geographic Meta Tags for Lucknow Ranking */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Lucknow" />
        <meta name="geo.position" content="26.8467;80.9462" />
        <meta name="ICBM" content="26.8467, 80.9462" />

        {/* Social Media (Open Graph) */}
        <meta property="og:title" content="Digital Infratech Lucknow - Construction Supplies Delivered" />
        <meta property="og:description" content="Your trusted partner for building materials in Lucknow. Quality equipment and home accessories delivered directly to your site." />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}og-lucknow-banner.jpg`} />

        {/* Local Business Schema for Lucknow */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HardwareStore",
            "name": "Digital Infratech",
            "url": siteUrl,
            "logo": `${siteUrl}logo.png`,
            "image": `${siteUrl}storefront-lucknow.jpg`,
            "description": "Leading supplier of building materials, construction equipment, and home accessories in Lucknow, Uttar Pradesh.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Your Specific Area in Lucknow",
              "addressLocality": "Lucknow",
              "addressRegion": "UP",
              "postalCode": "226001", // Update with your actual PIN code
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 26.8467,
              "longitude": 80.9462
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "09:00",
              "closes": "20:00"
            },
            "sameAs": [
              "https://www.facebook.com/digitalinfratech",
              "https://www.instagram.com/digitalinfratech"
            ]
          })}
        </script>
      </Helmet>

      <HeroSection />
      <CategoriesSection />
      <BestDeals />
      <HeroStack />
    </div>
  );
}