export type DonationCreateRequest = {
    donorName: string;
    donorEmail: string;
    amount: number;
    expirationMonth: string;
    expirationYear: string;
    transientTokenJwt: string;
  };