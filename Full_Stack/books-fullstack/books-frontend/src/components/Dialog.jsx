import { useEffect, useRef } from 'react';

// Wraps the native <dialog>. Children mount only while open, so forms reset every time.
export default function Dialog({ open, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose}>
      {open && children}
    </dialog>
  );
}
