import { createContext, useContext } from 'react';

export const OrderFormContext = createContext();

export const useOrderForm = () => {
  const context = useContext(OrderFormContext);
  if (!context) {
    throw new Error('useOrderForm must be used within an OrderFormProvider');
  }
  return context;
};

export const OrderFormProvider = ({ children, value }) => {
  return (
    <OrderFormContext.Provider value={value}>
      {children}
    </OrderFormContext.Provider>
  );
};