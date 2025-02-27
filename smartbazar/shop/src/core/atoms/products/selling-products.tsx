import ProductLoader from '@/core/atoms/ui/loaders/product-loader';
import NotFound from '@/core/atoms/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/core/atoms/products/cards/card';
import ErrorMessage from '@/core/atoms/ui/error-message';
import { usePopularProducts } from '@/framework/product';
import SectionBlock from '@/core/atoms/ui/section-block';
import { useTranslation } from 'next-i18next';
import { Image } from '@/core/atoms/ui/image';
import { siteSettings } from '@/settings/site';
import { productPlaceholder } from '@/lib/placeholders';
import Link from '@/core/atoms/ui/link';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/router';
import classNames from 'classnames';

interface Props {
  className?: string;
  limit?: number;
}

export default function SellingProductsGrid({ className, limit = 6 }: Props) {
  const { t } = useTranslation('common');
  const { products, isLoading, error } = usePopularProducts({ range: 30 });
  const router = useRouter();

  if (error) return <ErrorMessage message={error.message} />;

  if (!isLoading && !products.length) {
    return (
      <SectionBlock title={t('text-selling-books')}>
        <NotFound text="text-not-found" className="mx-auto w-7/12" />
      </SectionBlock>
    );
  }

  return (
    <SectionBlock title={t('text-selling-books')}>
      <div
        className={classNames(
          'grid w-full grid-cols-4 gap-6 xl:gap-8',
          className
        )}
      >
        <Link
          href={`${router.query.pages && router.query.pages[0]}${
            ROUTES.SEARCH
          }`}
          className="relative h-full w-full"
        >
          <Image
            src={
              siteSettings?.sellingAdvertisement?.image?.src ??
              productPlaceholder
            }
            alt={siteSettings?.sellingAdvertisement?.image?.alt}
            layout="responsive"
            width={426}
            height={990}
          />
        </Link>

        <div className="col-span-3 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 xl:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] xl:gap-8 2xl:grid-cols-3 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
          {isLoading && !products.length
            ? rangeMap(limit, (i) => (
                <ProductLoader key={i} uniqueKey={`product-${i}`} />
              ))
            : products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
        </div>
      </div>
    </SectionBlock>
  );
}
