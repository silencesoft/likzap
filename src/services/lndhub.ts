import fetch from 'node-fetch';

import { Balance, Invoice, InvoiceResponse, PaymentResponse, Server } from '../interfaces/lndhub';
import { request } from '../utils/request';

const defaultUrl = 'lndhub://user:password@http://localhost';

/*
URL {
  href: 'lndhub://user:password@http//localhost',
  origin: 'null',
  protocol: 'lndhub:',
  username: 'user',
  password: 'password',
  host: 'http',
  hostname: 'http',
  port: '',
  pathname: '//localhost',
  search: '',
  searchParams: URLSearchParams {},
  hash: ''
}
*/
export class LndhubRestClient {
  url: string;

  constructor(url = defaultUrl) {
    this.url = url;
  }

  async authentication(): Promise<string> {
    const url = this.getUrl();

    const response = await fetch(`${url.server}/auth?type=auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        login: url.username,
        password: url.password,
        refresh_token: '',
      }),
    });

    if (response.ok) {
      const data = await response.json();

      return data.access_token;
    }

    return '';
  }

  getUrl(): Server {
    const url = new URL(this.url);

    return {
      username: url.username,
      password: url.password,
      server: `${url.hostname}:${url.pathname}${url.port ? ':' + url.port : ''}`,
    };
  }

  async getInvoice({ amount, description }: Invoice): Promise<InvoiceResponse | undefined> {
    const access_token = await this.authentication();
    const url = this.getUrl();

    if (access_token) {
      const uri = `${url.server}/addinvoice`;
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          amt: amount,
          memo: description,
        }),
      };

      const response = await fetch(uri, options);

      if (response.ok) {
        const data = await response.json();

        return data;
      }
    }

    return undefined;
  }

  async getPayment(paymentHash: string): Promise<any> {
    const access_token = await this.authentication();
    const url = this.getUrl();

    if (access_token) {
      const uri = `${url.server}/checkpayment/${paymentHash}`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
        },
      };

      const response = await fetch(uri, options);

      const data = await response.json();

      return data;
    }

    return undefined;
  }

  async payInvoice(invoice: string, amount: number, eventId?: string): Promise<PaymentResponse> {
    const access_token = await this.authentication();
    const url = this.getUrl();
    if (access_token) {
      const total = await this.getBalance();

      if (total > amount) {
        const path = `${url.server}/payinvoice`;
        const options = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            invoice,
          }),
        };

        const doPayment: PaymentResponse = await request(path, options);

        return doPayment;
      }
    }

    return {} as PaymentResponse;
  }

  async getBalance(): Promise<number> {
    const access_token = await this.authentication();
    const url = this.getUrl();

    const path = `${url.server}/balance`;


    const balance: Balance = await request(path, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const total = balance?.BTC?.AvailableBalance || 0;

    return total;
  }
}


