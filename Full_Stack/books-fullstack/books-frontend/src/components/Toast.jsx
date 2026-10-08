import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const notify = useCallback((message, error = false) => {
    setToast({ message, error });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div id="toast" role="status" className={toast ? `show${toast.error ? ' err' : ''}` : ''}>
        {toast?.message}
      </div>
    </ToastContext.Provider>
  );
}
