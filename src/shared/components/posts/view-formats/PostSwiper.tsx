import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

import { IPostData } from '../../../api/posts/PostsService';
import { SwiperSlidePost } from '../single/PostSlide';

import 'swiper/css';
import React, { useId, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface ISwiperSeeMoreProps {
  redirect: string;
}

export const SwiperSeeMore: React.FC<ISwiperSeeMoreProps> = ({ redirect }) => {
  return (
    <Link to={redirect} className="text-center flex h-full items-center justify-center p-6">
      <p className="font-montserrat font-medium text-2xl md:text-3xl font-light highlight-link">
        Ver todas as publicações
      </p>
    </Link>
  );
};

interface ISwiperPosts {
  posts: IPostData[];
  slidesPerView?: number;
  redirectSeeMore?: string;
}

export const SwiperPosts: React.FC<ISwiperPosts> = ({ posts, slidesPerView = 2, redirectSeeMore = '/posts' }) => {
  const rawId = useId();
  const sanitizedId = rawId.replace(/[:.]/g, '-');
  const prevButtonClass = `swiper-button-prev-${sanitizedId}`;
  const nextButtonClass = `swiper-button-next-${sanitizedId}`;

  const swiperRef = useRef<SwiperType | null>(null);

  const handleMouseEnter = () => {
    swiperRef.current?.autoplay?.start();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.autoplay?.stop();
  };


  return (
    <div>
      <div 
        className="border-x border-gray-800"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}

      >
        <Swiper
          slidesPerView={Math.min(posts.length, slidesPerView)}
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: `.${nextButtonClass}`,
            prevEl: `.${prevButtonClass}`,
          }}
          // autoplay={{ delay: 5000 }}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false, // opcional
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.autoplay.stop(); // garante que começa parado
          }}
          
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id} style={{ height: 'auto' }}>
              <Link to={`/${post.type === 'texto' ? 'posts' : 'pilulas'}/${post.canonicalUrl}`}>
                <SwiperSlidePost post={post} />
              </Link>
            </SwiperSlide>
          ))}
          <SwiperSlide style={{ height: 'auto' }}>
            <SwiperSeeMore redirect={redirectSeeMore} />
          </SwiperSlide>
        </Swiper>
      </div>
      {/* Menu de navegação */}
      <div className="swiper-navigation flex">
        <div
          className={`${prevButtonClass} flex grow justify-center hover:bg-primary cursor-pointer py-6 border-t border-l border-r border-gray-950`}
        >
          <ArrowLongLeftIcon className="size-12" />
        </div>
        <div
          className={`${nextButtonClass} flex grow justify-center hover:bg-primary cursor-pointer py-6 border-t border-r border-gray-950`}
        >
          <ArrowLongRightIcon className="size-12" />
        </div>
      </div>
    </div>
  );
};
