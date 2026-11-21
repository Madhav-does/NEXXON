export interface MockUser {
  id: string;
  name: string;
  role: 'buyer' | 'seller' | 'support';
  avatar: string;
  email: string;
  badge?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  sellerId: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  condition: 'New' | 'Like New' | 'Open Box' | 'Refurbished';
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user_buyer_1',
    name: 'Alex Rivera',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    email: 'alex.buyer@nexxon.market',
    badge: 'Verified Buyer',
  },
  {
    id: 'user_seller_1',
    name: 'Sara Studio (Audio & Mech)',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    email: 'sara@studiocraft.example',
    badge: 'Top Rated Seller',
  },
  {
    id: 'user_seller_2',
    name: 'TechCraft Workspace',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    email: 'contact@techcraftgear.example',
    badge: 'Pro Merchant',
  },
  {
    id: 'user_support_agent',
    name: 'Emma (Nexxon Support)',
    role: 'support',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    email: 'support-agent-emma@nexxon.market',
    badge: 'Official Support',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Keychron Q1 Pro Custom Wireless Mechanical Keyboard',
    price: 199.0,
    category: 'Electronics',
    description:
      '75% layout QMK/VIA wireless custom mechanical keyboard, fully CNC-machined aluminum body, hot-swappable red switches, double-gasket design.',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    sellerId: 'user_seller_1',
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    condition: 'New',
  },
  {
    id: 'prod_2',
    title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    price: 349.99,
    category: 'Audio',
    description:
      'Industry-leading dual-processor active noise cancellation, 30-hour battery life, crystal clear hands-free calling with 8 microphones.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    sellerId: 'user_seller_1',
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    condition: 'Like New',
  },
  {
    id: 'prod_3',
    title: 'Herman Miller Embody Ergonomic Office Chair',
    price: 1245.0,
    category: 'Furniture',
    description:
      'Engineered with ergonomics specialists to promote natural alignment and healthy circulation during long working sessions. Fully adjustable arms.',
    image:
      'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?auto=format&fit=crop&w=800&q=80',
    sellerId: 'user_seller_2',
    rating: 5.0,
    reviewCount: 19,
    inStock: true,
    condition: 'Refurbished',
  },
  {
    id: 'prod_4',
    title: 'Dell UltraSharp 32" 4K UHD USB-C Hub Monitor (U3223QE)',
    price: 689.0,
    category: 'Displays',
    description:
      'IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 color reproduction, integrated 90W USB-C hub, RJ45 Ethernet, and KVM switch.',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    sellerId: 'user_seller_2',
    rating: 4.7,
    reviewCount: 42,
    inStock: true,
    condition: 'New',
  },
  {
    id: 'prod_5',
    title: 'Fujifilm X-T5 Mirrorless Digital Camera (Silver Body)',
    price: 1699.0,
    category: 'Photography',
    description:
      '40.2MP X-Trans CMOS 5 HR sensor, 5-axis 7-stop in-body image stabilization, 6.2K/30p 10-bit internal recording, classic tactile dial control.',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    sellerId: 'user_seller_1',
    rating: 4.9,
    reviewCount: 57,
    inStock: true,
    condition: 'Open Box',
  },
  {
    id: 'prod_6',
    title: 'Solid American Walnut Minimalist Desk Organizer Shelf',
    price: 89.0,
    category: 'Workspace',
    description:
      'Handcrafted sustainably harvested walnut with natural oil finish. Hidden cable routing, brass accents, and felt-lined phone tray.',
    image:
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    sellerId: 'user_seller_2',
    rating: 4.8,
    reviewCount: 81,
    inStock: true,
    condition: 'New',
  },
];

export function getUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}
