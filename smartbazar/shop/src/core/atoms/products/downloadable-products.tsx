import ErrorMessage from '@/core/atoms/ui/error-message';
import {
  useGenerateDownloadableUrl,
  useDownloadableProducts,
} from '@/framework/order';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import Link from '@/core/atoms/ui/link';
import { ROUTES } from '@/lib/routes';
import Button from '@/core/atoms/ui/button';
import { productPlaceholder } from '@/lib/placeholders';
import isEmpty from 'lodash/isEmpty';
import NotFound from '@/core/atoms/ui/not-found';

const DownloadableProducts: React.FC = () => {
  const { t } = useTranslation('common');
  const { downloads, error, loadMore, isLoading, hasMore } =
    useDownloadableProducts({
      limit: 10,
    });

  const { generateDownloadableUrl } = useGenerateDownloadableUrl();

  if (error) return <ErrorMessage message={error.message} />;
  const isVariableProduct = (product: any) =>
    !isEmpty(product.file.fileable.product);
  return (
    <>
      {!downloads.length && (
        <NotFound
          text="text-no-download"
          className="mx-auto w-full md:w-7/12"
        />
      )}
      {downloads.map((item) => (
        <div
          key={item.purchase_key}
          className="flex w-full space-x-4 border-b border-gray-200 py-5 first:pt-0 last:border-0 last:pb-0 rtl:space-x-reverse sm:space-x-5"
        >
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
            <Image
              src={
                isVariableProduct(item)
                  ? item?.file?.fileable?.product?.image?.original!
                  : item?.file?.fileable?.image?.original! ?? productPlaceholder
              }
              alt="text"
              layout="fill"
            />
          </div>

          <div className="flex w-full flex-col items-start sm:flex-row sm:justify-between sm:space-x-4 rtl:sm:space-x-reverse">
            <div className="flex w-full flex-col space-y-1 sm:items-start">
              <Link
                href={`${ROUTES.PRODUCT}/${
                  isVariableProduct(item)
                    ? item?.file?.fileable?.product?.slug
                    : item?.file?.fileable?.slug
                }`}
                className="text-base font-semibold text-heading transition-colors hover:text-accent"
              >
                {!isVariableProduct(item) && item?.file?.fileable?.name}
                {isVariableProduct(item) && (
                  <>
                    {item?.file?.fileable?.product?.name}
                    <span className="inline-block text-sm ltr:clear-left ltr:ml-1 rtl:clear-right rtl:mr-1">
                      ({item?.file?.fileable?.title})
                    </span>
                  </>
                )}
              </Link>

              <p className="space-y-1 sm:space-x-1 sm:space-y-0 rtl:sm:space-x-reverse">
                <span className="block text-sm font-semibold text-body-dark sm:inline-block sm:w-auto">
                  {t('text-key')}: {item?.purchase_key}
                </span>
                <span className="hidden text-sm text-body sm:inline-block">
                  |
                </span>
                <span className="block text-sm text-body sm:inline-block">
                  {t('text-purchased-on')}{' '}
                  {dayjs(item?.created_at).format('DD.MM.YYYY')}
                </span>
              </p>
            </div>

            <button
              className="mt-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover sm:mt-0"
              onClick={() => generateDownloadableUrl(item?.digital_file_id)}
            >
              {t('text-download')}
            </button>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="mt-8 flex w-full justify-center">
          <Button loading={isLoading} onClick={loadMore}>
            {t('text-load-more')}
          </Button>
        </div>
      )}
    </>
  );
};

export default DownloadableProducts;
