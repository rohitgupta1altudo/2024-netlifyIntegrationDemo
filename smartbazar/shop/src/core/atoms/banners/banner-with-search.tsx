import cn from 'classnames';
// import { Waypoint } from 'react-waypoint';
import { Swiper, SwiperSlide, Navigation } from '@/core/atoms/ui/slider';
import { Image } from '@/core/atoms/ui/image';
import { Banner } from '@/types';
import { productPlaceholder } from '@/lib/placeholders';
import Search from '@/core/atoms/ui/search/search';
// import { useAtom } from 'jotai';
// import { displayHeaderSearchAtom } from '@/store/display-header-search-atom';

interface BannerProps {
  banners: Banner[] | undefined;
  layout?: string;
  userName?: string;
}

const BannerWithSearch: React.FC<BannerProps> = ({
  banners,
  layout,
  userName,
}) => {
  // const [_, setDisplayHeaderSearch] = useAtom(displayHeaderSearchAtom);

  // const onWaypointPositionChange = ({
  //   currentPosition,
  // }: Waypoint.CallbackArgs) => {
  //   if (!currentPosition || currentPosition === 'above') {
  //     setDisplayHeaderSearch(true);
  //   }
  // };

  return (
    <div
      className={cn('relative hidden lg:block', {
        '!block': layout === 'minimal',
      })}
    >
      <div className="-z-1 overflow-hidden">
        <div className="relative">
          <Swiper
            id="banner"
            loop={banners && banners.length > 1}
            modules={[Navigation]}
            resizeObserver={true}
            allowTouchMove={false}
            slidesPerView={1}
          >
            {banners?.map((banner, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className={cn('relative h-[600px] w-full', {
                    'max-h-140': layout === 'standard',
                    'max-h-[320px] md:max-h-[680px]': layout === 'minimal',
                  })}
                >
                  <Image
                    className="-top-[220px] h-full min-h-140 w-full"
                    src={banner.image?.original ?? productPlaceholder}
                    alt={banner.title ?? ''}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div
                    className={cn(
                      'absolute inset-0 mt-8 flex w-full flex-col items-center justify-center p-5 text-center md:px-20 lg:space-y-10',
                      {
                        'space-y-5 md:!space-y-8': layout === 'minimal',
                      }
                    )}
                  >
                    <h1
                      className={cn(
                        'text-2xl font-bold tracking-tight text-heading lg:text-4xl xl:text-5xl',
                        {
                          '!text-accent': layout === 'minimal',
                        }
                      )}
                    >
                      {userName
                        ? `Hi ${userName}, ${banner?.title}`
                        : banner?.title}
                    </h1>
                    <p className="text-sm text-heading lg:text-base xl:text-lg">
                      {banner?.description}
                    </p>
                    <div className="w-full max-w-3xl">
                      <Search label="search" />
                    </div>
                    {/* <Waypoint
                      onLeave={() => setDisplayHeaderSearch(true)}
                      onEnter={() => setDisplayHeaderSearch(false)}
                      onPositionChange={onWaypointPositionChange}
                    /> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default BannerWithSearch;
