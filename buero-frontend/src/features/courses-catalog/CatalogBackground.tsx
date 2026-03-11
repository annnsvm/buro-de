import React from 'react';

const CatalogBackground: React.FC = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url(/images/courses/choose.webp)] bg-cover bg-center bg-no-repeat"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
    </>
  );
};

export default CatalogBackground;
