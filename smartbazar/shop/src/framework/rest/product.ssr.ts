import type { Product, TypeQueryOptions } from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import client from './client';
import { dehydrate } from 'react-query/hydration';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { QueryClient } from 'react-query';
import { TYPES_PER_PAGE } from './client/variables';

// This function gets called at build time
type ParsedQueryParams = {
  slug: string;
  catalog: string;
};
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  const catalogs = await client.types.all();
  const products = await Promise.all(
    catalogs.map((catalog) =>
      client.products.all({ limit: 100, type: catalog.id })
    )
  );
  const paths = catalogs.flatMap(({ id: catalogId }, index) =>
    products[index].data?.flatMap((product) =>
      locales.map((locale) => ({
        params: { slug: product.slug.toString(), catalog: catalogId },
        locale,
      }))
    )
  );
  return {
    paths,
    fallback: 'blocking',
  };
};
type PageProps = {
  product: Product;
};
export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const { slug } = params!; //* we know it's required because of getStaticPaths

  const queryClient = new QueryClient();

  const types = await queryClient.fetchQuery(
    [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE }],
    ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
  );

  await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS], () =>
    client.settings.all({})
  );

  const { catalog } = params!;
  let pageType: string | undefined;
  if (!catalog) {
    pageType =
      types.find((type) => type.settings.isHome)?.slug ?? types[0].slug;
  } else {
    pageType = catalog as string;
  }

  const product = await client.products.get(slug);
  try {
    return {
      props: {
        product,
        variables: {
          types: {
            type: pageType,
          },
        },
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
