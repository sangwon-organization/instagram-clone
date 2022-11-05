import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagProps {
  title: string;
  description: string;
  keywords: string;
  imgsrc: string;
  url: string;
}

const MetaTag = ({
  title,
  description,
  keywords,
  imgsrc,
  url,
}: MetaTagProps) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} data-react-helmet="true" />
      <meta name="keywords" content={keywords} data-react-helmet="true" />

      <meta property="og:type" content="website" data-react-helmet="true" />
      <meta property="og:title" content={title} data-react-helmet="true" />
      <meta property="og:site_name" content={title} data-react-helmet="true" />
      <meta
        property="og:description"
        content={description}
        data-react-helmet="true"
      />
      <meta property="og:image" content={imgsrc} data-react-helmet="true" />
      <meta property="og:url" content={url} data-react-helmet="true" />

      <meta name="twitter:title" content={title} data-react-helmet="true" />
      <meta
        name="twitter:description"
        content={description}
        data-react-helmet="true"
      />
      <meta name="twitter:image" content={imgsrc} data-react-helmet="true" />

      <link rel="canonical" href={url} data-react-helmet="true" />
    </Helmet>
  );
};

export default MetaTag;
