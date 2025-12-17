// src/components/SEO.tsx
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
}

export const SEO = ({ 
  title = "TradeOmen", 
  description = "AI-Powered Trading Intelligence and automated journaling.", 
  name = "TradeOmen", 
  type = "website" 
}: SEOProps) => {
  const siteTitle = title === "TradeOmen" ? title : `${title} | TradeOmen`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      
      {/* Twitter */}
      <meta name="twitter:creator" content="@TradeOmen" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};