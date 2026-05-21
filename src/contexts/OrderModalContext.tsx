import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import OrderStorePickerModal from "@/components/OrderStorePickerModal";

type OrderModalContextValue = {
  open: () => void;
  close: () => void;
};

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

export const OrderModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <OrderModalContext.Provider value={{ open, close }}>
      {children}
      <OrderStorePickerModal open={isOpen} onClose={close} />
    </OrderModalContext.Provider>
  );
};

export const useOrderModal = (): OrderModalContextValue => {
  const ctx = useContext(OrderModalContext);
  if (!ctx) throw new Error("useOrderModal must be used inside OrderModalProvider");
  return ctx;
};
