import { CloseIcon } from '@/core/atoms/icons/close-icon';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { useTranslation } from 'next-i18next';

export default function Modal({ open, onClose, children }: any) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('common');

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={cancelButtonRef}
        static
        open={open}
        onClose={onClose}
      >
        <div className="min-h-full text-center md:p-5">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 h-full w-full bg-gray-900 bg-opacity-50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="min-w-content relative inline-block max-w-full align-middle transition-all ltr:text-left rtl:text-right">
              <button
                onClick={onClose}
                aria-label="Close panel"
                ref={cancelButtonRef}
                className="absolute top-4 z-[60] inline-block outline-none focus:outline-none ltr:right-4 rtl:left-4 lg:hidden"
              >
                <span className="sr-only">{t('text-close')}</span>
                <CloseIcon className="h-4 w-4" />
              </button>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
