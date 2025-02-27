import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/core/atoms/layouts/layout';
import Seo from '@/core/atoms/seo/seo';
import Button from '@/core/atoms/ui/button';
import CartCounterButton from '@/core/atoms/cart/cart-counter-button';
import NotFound from '@/core/atoms/ui/not-found';
import { useTranslation } from 'next-i18next';
import rangeMap from '@/lib/range-map';
import CouponLoader from '@/core/atoms/ui/loaders/coupon-loader';
import { useCoupons } from '@/framework/coupon';
import ErrorMessage from '@/core/atoms/ui/error-message';
import CouponCard from '@/core/atoms/ui/cards/coupon';
export { getStaticProps } from '@/framework/coupon.ssr';

const OffersPage: NextPageWithLayout = () => {
  const limit = 20;
  const { t } = useTranslation('common');
  const { isLoading, isLoadingMore, hasMore, coupons, error, loadMore } =
    useCoupons();
  if (error) return <ErrorMessage message={error.message} />;
  if (!isLoading && !coupons.length) {
    return (
      <div className="min-h-full bg-gray-100 px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-no-coupon" />
      </div>
    );
  }

  return (
    <>
      <Seo title="Offers" url="offers" />
      <div className="mx-auto w-full max-w-1920 bg-gray-100 px-4 py-8 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-8 2xl:grid-cols-6">
          {isLoading && !coupons.length
            ? rangeMap(limit, (i) => (
                <CouponLoader key={i} uniqueKey={`coupon-${i}`} />
              ))
            : coupons.map((item) => <CouponCard key={item.id} coupon={item} />)}
        </div>
        {hasMore && (
          <div className="mt-8 flex items-center justify-center lg:mt-12">
            <Button onClick={loadMore} loading={isLoadingMore}>
              {t('text-load-more')}
            </Button>
          </div>
        )}
      </div>
      <CartCounterButton />
    </>
  );
};

OffersPage.getLayout = getLayout;

export default OffersPage;
