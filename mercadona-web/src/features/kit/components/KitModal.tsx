'use client';

import { useId } from 'react';
import { Modal } from '@/features/home/components/Modal';
import { KitExperience } from '@/features/kit/components/KitExperience';

type KitModalProps = {
  idea: string;
  open: boolean;
  onClose: () => void;
  onViewDishes: () => void;
};

export function KitModal({ idea, open, onClose, onViewDishes }: KitModalProps) {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onClose} titleId={titleId} variant="sheet" className="bg-white">
      <h2 id={titleId} className="sr-only">
        MercaKit
      </h2>
      {/* Remount on each open so conversation + loading start from zero */}
      {open ? (
        <KitExperience idea={idea} onClose={onClose} onViewDishes={onViewDishes} />
      ) : null}
    </Modal>
  );
}
