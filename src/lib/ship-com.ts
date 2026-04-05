
export interface ShipTo {
  name: string;
  phone?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShipComRate {
  shippingMethod: string;
  serviceLevel: string;
  packageID: string;
  rateID: string;
  amount: number;
}

export class ShipComClient {
  private baseUrl = 'https://app.ship.com/public';
  private apiKey = process.env.SHIP_COM_API_KEY;

  private getHeaders() {
    if (!this.apiKey) {
      throw new Error('SHIP_COM_API_KEY is not configured');
    }
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createOrder(params: {
    orderNumber: string;
    to: ShipTo;
    from?: ShipTo;
    metadata?: Record<string, any>;
  }) {
    const from = params.from ?? {
      name: process.env.SHIP_FROM_NAME!,
      company: process.env.SHIP_FROM_COMPANY ?? '',
      phone: process.env.SHIP_FROM_PHONE ?? '',
      address1: process.env.SHIP_FROM_ADDRESS1!,
      address2: process.env.SHIP_FROM_ADDRESS2 ?? '',
      city: process.env.SHIP_FROM_CITY!,
      state: process.env.SHIP_FROM_STATE!,
      postalCode: process.env.SHIP_FROM_POSTAL_CODE!,
      country: process.env.SHIP_FROM_COUNTRY ?? 'US',
    };

    const parcels = [
      {
        length: Number(process.env.PACKAGE_LENGTH_IN ?? 9),
        width: Number(process.env.PACKAGE_WIDTH_IN ?? 6),
        height: Number(process.env.PACKAGE_HEIGHT_IN ?? 1),
        distanceUnit: 'in',
        weight: Number(process.env.PACKAGE_WEIGHT_OZ ?? 12),
        massUnit: 'oz',
      },
    ];

    const body = {
      orderNumber: params.orderNumber,
      from,
      to: params.to,
      parcels,
      metadata: params.metadata,
    };

    const response = await fetch(`${this.baseUrl}/order`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create Ship.com order: ${error}`);
    }

    const data = await response.json();
    const orderId = data.orderID ?? data.orderId ?? data.id ?? data._id ?? data.data?.orderID ?? data.data?.id;
    
    if (!orderId) {
      throw new Error('Unable to find order ID in Ship.com response');
    }

    return orderId;
  }

  async getRates(orderId: string): Promise<ShipComRate[]> {
    const response = await fetch(`${this.baseUrl}/shipping-info`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ orderID: orderId }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get Ship.com rates: ${error}`);
    }

    const data = await response.json();
    const prices = data.Prices ?? data.prices ?? data.rates ?? data.data?.Prices ?? data.data?.rates ?? [];

    if (!Array.isArray(prices) || prices.length === 0) {
      throw new Error('No rates returned from Ship.com');
    }

    return prices.map((r: any) => ({
      shippingMethod: r.ShippingMethod ?? r.shippingMethod ?? r.method,
      serviceLevel: r.ServiceLevel ?? r.serviceLevel ?? r.service,
      packageID: r.PackageID ?? r.packageID ?? r.packageId,
      rateID: r.RateID ?? r.rateID ?? r.rateId ?? r.id,
      amount: Number(r.TotalAmount ?? r.totalAmount ?? r.rate ?? r.price ?? r.amount ?? Infinity),
    }));
  }

  async purchaseLabel(params: {
    orderId: string;
    rate: ShipComRate;
  }) {
    const body = {
      orderID: params.orderId,
      shippingMethod: params.rate.shippingMethod,
      serviceLevel: params.rate.serviceLevel,
      packageID: params.rate.packageID,
      rateID: params.rate.rateID,
    };

    const response = await fetch(`${this.baseUrl}/purchase-label`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to purchase Ship.com label: ${error}`);
    }

    return await response.json();
  }
}
