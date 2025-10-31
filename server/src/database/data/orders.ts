export const orders = [
  {
    user: { user_id: 2 },
    room: { room_id: 1 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-1.png',
    start_time: '2025-11-01T12:00:00',
    end_time: '2025-11-01T14:00:00',
    price: 400,
    createdAt: '2025-10-25T11:00:00',
  },
  {
    user: { user_id: 2 },
    room: { room_id: 1 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-1.png',
    start_time: '2025-11-01T16:00:00',
    end_time: '2025-11-01T18:00:00',
    price: 400,
    createdAt: '2025-10-25T15:00:00',
  },
  {
    user: { user_id: 2 },
    room: { room_id: 2 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-2.png',
    start_time: '2025-10-25T15:00:00',
    end_time: '2025-10-25T20:00:00',
    price: 1200,
    createdAt: '2025-10-25T14:00:00',
  },
  {
    user: { user_id: 3 },
    room: null,
    zone: { zone_id: 1 },
    qr_url: 'https://example.com/qr/qr-3.png',
    start_time: '2025-10-26T09:00:00',
    end_time: '2025-10-26T12:00:00',
    price: 300,
    createdAt: '2025-10-26T08:00:00',
  },
  {
    user: { user_id: 4 },
    room: { room_id: 3 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-4.png',
    start_time: '2025-10-26T18:00:00',
    end_time: '2025-10-26T22:00:00',
    price: 1500,
    createdAt: '2025-10-26T17:00:00',
  },
  {
    user: { user_id: 5 },
    room: null,
    zone: { zone_id: 5 },
    qr_url: 'https://example.com/qr/qr-5.png',
    start_time: '2025-10-27T10:00:00',
    end_time: '2025-10-27T13:00:00',
    price: 450,
    createdAt: '2025-10-27T09:00:00',
  },
  {
    user: { user_id: 6 },
    room: { room_id: 4 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-6.png',
    start_time: '2025-10-27T14:00:00',
    end_time: '2025-10-27T17:00:00',
    price: 600,
    createdAt: '2025-10-27T13:00:00',
  },
  {
    user: { user_id: 7 },
    room: { room_id: 5 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-7.png',
    start_time: '2025-10-28T08:00:00',
    end_time: '2025-10-28T12:00:00',
    price: 2000,
    createdAt: '2025-10-28T07:00:00',
  },
  {
    user: { user_id: 8 },
    room: null,
    zone: { zone_id: 8 },
    qr_url: 'https://example.com/qr/qr-8.png',
    start_time: '2025-10-28T13:00:00',
    end_time: '2025-10-28T15:00:00',
    price: 400,
    createdAt: '2025-10-28T12:00:00',
  },
  {
    user: { user_id: 9 },
    room: { room_id: 6 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-9.png',
    start_time: '2025-10-29T18:00:00',
    end_time: '2025-10-29T22:00:00',
    price: 1400,
    createdAt: '2025-10-29T17:00:00',
  },
  {
    user: { user_id: 10 },
    room: { room_id: 7 },
    zone: null,
    qr_url: 'https://example.com/qr/qr-10.png',
    start_time: '2025-10-30T09:00:00',
    end_time: '2025-10-30T15:00:00',
    price: 2500,
    createdAt: '2025-10-30T08:00:00',
  },

  // 30 orders for user_id: 3
  ...Array.from({ length: 30 }, (_, i) => {
    const day = 31 + i; // start from 31st October
    const startHour = 1 + (i % 15); // between 01:00 and 15:00
    const start = new Date(2025, 9, day, startHour, 0, 0); // month is 0-indexed
    const end = new Date(start);
    end.setHours(end.getHours() + 3);

    return {
      user: { user_id: 3 },
      room: null,
      zone: { zone_id: (i % 5) + 1 },
      qr_url: `https://example.com/qr/qr-3-${i + 1}.png`,
      start_time: start.toISOString().slice(0, 19), // remove timezone
      end_time: end.toISOString().slice(0, 19),
      price: 300 + (i % 5) * 50,
      createdAt: new Date(start.getTime() - 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19),
    };
  }),
];
