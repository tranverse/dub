export const RESEND_AUDIENCES = {
  "app.dub.co": "f5ff0661-4234-43f6-b0ca-a3f3682934e3",
  "partners.dub.co": "6caf6898-941a-45b6-a59f-d0780c3004ac",
};

// export const VARIANT_TO_FROM_MAP = {
//   primary: "Dub.co <system@dub.co>",
//   notifications: "Dub.co <notifications@mail.dub.co>",
//   marketing: "Steven from Dub.co <steven@ship.dub.co>",
// };
export const VARIANT_TO_FROM_MAP = {
  primary: `Buzz <system@${process.env.DOMAIN_SEND_EMAIL}>`,
  notifications: `Buzz <notifications@${process.env.DOMAIN_SEND_EMAIL}>`,
  marketing: `Buzz <marketing@${process.env.DOMAIN_SEND_EMAIL}>`,
};
