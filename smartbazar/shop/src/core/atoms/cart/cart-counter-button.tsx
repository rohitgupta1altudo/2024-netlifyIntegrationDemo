import CartCheckBagIcon from '@/core/atoms/icons/cart-check-bag';
import { formatString } from '@/lib/format-string';
import useCartEnabled from '@/lib/use-cart';
import usePrice from '@/lib/use-price';
import { drawerAtom } from '@/store/drawer-atom';
import { useCart } from '@/store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';

const CartCounterButton = () => {
  const { t } = useTranslation();
  const { isCartEnabled } = useCartEnabled();
  const { totalUniqueItems, total } = useCart();
  const [_, setDisplayCart] = useAtom(drawerAtom);
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  function handleCartSidebar() {
    setDisplayCart({ display: true, view: 'cart' });
  }

  if (isCartEnabled) {
    return (
      <button
        className="product-cart fixed top-1/2 z-40 -mt-12 hidden flex-col items-center justify-center rounded bg-accent p-3 pt-3.5 text-sm font-semibold text-light shadow-900 transition-colors duration-200 hover:bg-accent-hover focus:outline-none ltr:right-0 ltr:rounded-tr-none ltr:rounded-br-none rtl:left-0 rtl:rounded-tl-none rtl:rounded-bl-none lg:flex"
        onClick={handleCartSidebar}
      >
        <span className="flex pb-0.5">
          <CartCheckBagIcon className="shrink-0" width={14} height={16} />
          <span className="flex ltr:ml-2 rtl:mr-2">
            {formatString(totalUniqueItems, t('common:text-item'))}
          </span>
        </span>
        <span className="mt-3 w-full rounded bg-light py-2 px-2 text-accent">
          {totalPrice}
        </span>
      </button>
    );
  }
  return <></>;
};

export default CartCounterButton;
