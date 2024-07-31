import {
  Field,
  LinkField,
  Text,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useMemo } from 'react';
import { Product } from '@/types';
import Carousel from '@/core/atoms/ui/carousel';
import SimpleCardDescription from '@/core/atoms/ui/simple-card-w-description';
import Link from 'next/link';

type CardItem = ComponentProps & {
  displayName: string;
  url: string;
  fields: {
    Abstract: Field<string>;
    BreadcrumbTitle: Field<string>;
    ContentType: Field<string>;
    HideInBreadcrumb: Field<string>;
    Image: Field<string>;
    MetaDescription: Field<string>;
    MetaKeywords: Field<string>;
    MetaTitle: Field<string>;
    PageTitle: Field<string>;
    Title: Field<string>;
    Link: LinkField;
  };
};

const breakpoints = {
  320: {
    slidesPerView: 1,
  },

  600: {
    slidesPerView: 2,
  },

  960: {
    slidesPerView: 3,
  },

  1280: {
    slidesPerView: 3,
  },

  1600: {
    slidesPerView: 3,
  },
  2600: {
    slidesPerView: 5,
  },
};

type RelatedCardsProps = ComponentProps & {
  fields: {
    CardItems: CardItem[];
    HideDescription: Field<boolean>;
    IsCarousel: Field<boolean>;
    Title: Field<string>;
    Link: LinkField;
  };
};

const mapProducts = (cardItems?: any): Product[] =>
  cardItems?.map(
    (item: {
      url: string;
      displayName: string;
      fields: {
        Image: { value: { src: string; width: string; height: string } };
        Abstract: { value: string };
        Title: { value: string };
        Link: LinkField;
      };
    }) => ({
      id: item.url,
      name: item.fields?.Title?.value,
      description: item.fields?.Abstract?.value,
      link: item.fields?.Link.value,
      image: {
        original: item.fields?.Image.value?.src,
        thumbnail: item.fields?.Image.value?.src,
        width: parseFloat(item.fields?.Image?.value?.width) || 500,
        height: parseFloat(item.fields?.Image?.value?.height) || 500,
      },
    })
  );
const CategoryCarousel = (props: RelatedCardsProps): JSX.Element => {
  const products = useMemo(
    () => mapProducts(props?.fields?.CardItems),
    [props?.fields?.CardItems]
  );
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col p-8 pt-10">
      <section className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <header className="relative text-center">
          <h1 className="font-sans text-xl md:text-2xl xl:text-6xl">
            <Text field={props.fields?.Title} />
          </h1>
          <Link href={props.fields?.Link?.value?.href || '#'}>
            <a className="absolute -right-12 cursor-pointer">See all</a>
          </Link>
        </header>
      </section>
      <Carousel items={products} breakpoints={breakpoints} spaceBetween={30}>
        {(item) => <SimpleCardDescription item={item} />}
      </Carousel>
    </div>
  );
};

export default withDatasourceCheck()<RelatedCardsProps>(CategoryCarousel);
