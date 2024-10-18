import React from 'react';
import Image from 'next/image';

function Page() {
  return (
    <div className="relative h-[600px]">
      <div className="absolute inset-0">
        <Image
          src="/banner.jpg"
          fill
          objectFit="cover"
          alt="Banner image"
          className="z-0"
        />
      </div>
      <div className="absolute inset-0 flex justify-center items-center z-10 hover:backdrop-blur-sm bg-black/50">
        <h1 className="text-white text-4xl font-bold">Find Your Perfect Candidate</h1>
      </div>
    </div>
  );
}

export default Page;
