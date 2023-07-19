export interface Auth {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expiry: string;
}

export interface Balance {
  BTC: {
    TotalBalance: number;
    AvailableBalance: number;
    UncomfirmedBalance: number;
  };
}

export interface PaymentResponse {
  type?: string;
}

export interface Invoice {
  amount: number;
  label: string;
  description?: string;
}

export interface InvoiceResponse {
  payment_hash: string;
}

export interface CheckPaymentResponse {
  data: {
    paid: boolean;
    preimage?: string;
  };
};

export interface Server {
  server: string;
  username: string;
  password: string;
}
