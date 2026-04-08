export const schedule = [
  { day: 'Mon', title: 'Organic pickup', time: '07:30 - 09:00', tone: '#BDEFCF' },
  { day: 'Wed', title: 'Plastic sorting van', time: '08:00 - 10:00', tone: '#C8F5EE' },
  { day: 'Sat', title: 'Bulky waste route', time: '09:00 - 12:00', tone: '#FFF2CB' },
];

export const quickActions = [
  { id: 'pickup', title: 'Request pickup', subtitle: 'Book a municipal collection', icon: 'truck-outline' },
  { id: 'report', title: 'Report overflow', subtitle: 'Flag bins that need attention', icon: 'alert-circle-outline' },
  { id: 'guide', title: 'Sorting guide', subtitle: 'Learn what goes where', icon: 'leaf-outline' },
];

export const requests = [
  {
    id: 'EG-2048',
    title: 'Household waste pickup',
    status: 'Collector assigned',
    eta: 'Today, 18 min',
    address: '12 Cedar Block, Green District',
    progress: 0.72,
  },
  {
    id: 'EG-2014',
    title: 'Recycling bag refill',
    status: 'Scheduled',
    eta: 'Tomorrow, 09:00',
    address: 'Citizen service point',
    progress: 0.38,
  },
];

export const recyclingTips = [
  {
    title: 'Plastic & cans',
    body: 'Rinse containers quickly and flatten them to reduce pickup volume.',
    accent: '#48D7C8',
  },
  {
    title: 'Organic waste',
    body: 'Use compostable bags and move them out before 7 AM on collection day.',
    accent: '#18A558',
  },
  {
    title: 'Bulky items',
    body: 'Furniture and appliances need a request before curb placement.',
    accent: '#F6C85F',
  },
];

export const profileMetrics = [
  { label: 'Sorted this month', value: '84 kg' },
  { label: 'Requests closed', value: '12' },
  { label: 'Reward points', value: '1,260' },
];
