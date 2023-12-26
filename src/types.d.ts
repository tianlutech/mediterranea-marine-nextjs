export {};

declare global {
  interface Window {
    SumUpCard: {
      mount: (params: {
        id: string;
        checkoutId: string;
        onResponse: (type: any, body: any) => void;
      }) => void;
    };
  }
}
