import type { PropsWithChildren, ReactNode } from 'react';

interface ModalProps {
  title?: string;
  subtitle?: string;
  headerAddon?: ReactNode;
}

export function Modal({
  children,
  title,
  subtitle,
  headerAddon,
}: PropsWithChildren<ModalProps>) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-card--promo">
        {title || headerAddon ? (
          <div className="modal-header">
            {title ? <h2 className="modal-title">{title}</h2> : null}
            {headerAddon}
          </div>
        ) : null}
        {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}
