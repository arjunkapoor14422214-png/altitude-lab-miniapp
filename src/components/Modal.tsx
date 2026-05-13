import type { PropsWithChildren } from 'react';

interface ModalProps {
  title?: string;
  subtitle?: string;
}

export function Modal({
  children,
  title,
  subtitle,
}: PropsWithChildren<ModalProps>) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-card--promo">
        {title ? <h2 className="modal-title">{title}</h2> : null}
        {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}
