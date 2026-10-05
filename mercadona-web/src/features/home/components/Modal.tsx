'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  children: ReactNode;
  /** Full-bleed panel (MercaKit). Default is a centered card. */
  variant?: 'card' | 'sheet';
  className?: string;
  stackLayer?: 'base' | 'top';
};

export function Modal({
  open,
  onClose,
  titleId,
  children,
  variant = 'card',
  className = '',
  stackLayer = 'base',
}: ModalProps) {
  const fallbackTitleId = useId();
  const labelledBy = titleId ?? fallbackTitleId;
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow || '';
      document.documentElement.style.overflow = previousHtmlOverflow || '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) {
    return null;
  }

  const zClass = stackLayer === 'top' ? 'z-[60]' : 'z-50';

  return createPortal(
    <div className={`fixed inset-0 ${zClass} flex items-end justify-center sm:items-center`}>
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-[#214e52]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={
          variant === 'sheet'
            ? `relative flex h-[100dvh] w-full flex-col outline-none ${className}`
            : `relative mx-3 mb-3 max-h-[min(92dvh,880px)] w-full max-w-[920px] overflow-y-auto rounded-[24px] bg-white shadow-[0_24px_80px_rgba(33,78,82,0.28)] outline-none sm:mx-6 sm:mb-0 ${className}`
        }
      >
        {!titleId ? (
          <h2 id={fallbackTitleId} className="sr-only">
            Diálogo
          </h2>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
