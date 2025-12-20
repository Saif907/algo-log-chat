import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  name?: string;
  type?: string;
}

export const SEO = ({ 
  title = "TradeOmen", 
  description = "AI-Powered Trading Intelligence and automated journaling.", 
  image = "/og-image.png", // Ensure you have this image in your /public folder
  name = "TradeOmen", 
  type = "website" 
}: SEOProps) => {
  const { pathname } = useLocation();
  const siteUrl = "https://tradeomen.com"; // Your actual domain
  const canonicalUrl = `${siteUrl}${pathname}`;
  const siteTitle = title === "TradeOmen" ? title : `${title} | TradeOmen`;
  
  // Ensure image is an absolute URL for platforms like Twitter/LinkedIn
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={fullImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@TradeOmen" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};