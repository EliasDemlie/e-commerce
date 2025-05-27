const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    description:
      'High-quality wireless earbuds with noise cancellation and 12-hour battery life.',
    price: 49.99,
    brand: 'SoundPro',
    category: {
      name: 'Electronics',
      subCategories: ['Audio', 'Accessories'],
    },
    inStock: true,
    rating: 4,
    images: [
      {
        color: 'Black',
        colorCode: '#000000',
        views: {
          front: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          side: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          back: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        },
      },
      {
        color: 'White',
        colorCode: '#FFFFFF',
        views: {
          front: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          side: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          back: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Smartwatch Fitness Tracker',
    description:
      'Track your heart rate, steps, and sleep with this advanced smartwatch.',
    price: 89.99,
    brand: 'FitTech',
    category: {
      name: 'Electronics',
      subCategories: ['Wearables', 'Accessories'],
    },
    inStock: true,
    rating: 4,
    images: [
      {
        color: 'Midnight Blue',
        colorCode: '#191970',
        views: {
          front: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          side: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          back: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        },
      },
      {
        color: 'Black',
        colorCode: '#000000',
        views: {
          front: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          side: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          back: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        },
      },
    ],
  },
  {
    id: '3',
    name: '4K Ultra HD Smart TV',
    description:
      '55-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps.',
    price: 499.99,
    brand: 'VisionPlus',
    category: {
      name: 'Home Entertainment',
      subCategories: ['TVs', 'Audio'],
    },
    inStock: false,
    rating: 4,
    images: [
      {
        color: 'Silver',
        colorCode: '#C0C0C0',
        views: {
          front: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
          side: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
          back: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
        },
      },
      {
        color: 'Black',
        colorCode: '#000000',
        views: {
          front: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
          side: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
          back: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
        },
      },
    ],
  },
  {
    id: '5',
    name: 'Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    brand: 'AudioMaster',
    category: {
      name: 'Audio',
      subCategories: ['Headphones', 'Accessories'],
    },
    inStock: true,
    rating: 4,
    images: [
      {
        color: 'Space Gray',
        colorCode: '#A9A9A9',
        views: {
          front: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          side: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          back: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        },
      },
      {
        color: 'Black',
        colorCode: '#000000',
        views: {
          front: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          side: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          back: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        },
      },
    ],
  },
  {
    id: '67c1a0ba99e4635f721a8ccb',
    name: 'Portable Bluetooth Speaker',
    description:
      'Waterproof Bluetooth speaker with 20-hour playtime and deep bass.',
    price: 599.9,
    brand: 'BassBoom',
    category: {
      name: 'Audio',
      subCategories: ['Speakers', 'Accessories'],
    },
    inStock: true,
    rating: 4,
    images: ['Red', 'Blue', 'Black'].map((color) => ({
      color,
      colorCode:
        color === 'Red' ? '#FF0000' : color === 'Blue' ? '#0000FF' : '#000000',
      views: {
        front:
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
        side: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
        back: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
      },
    })),
  },
  {
    id: '65d3f2c57f3a2b0012c8a6e5',
    name: 'Smart Home Security Camera',
    description:
      '1080p HD security camera with motion detection and night vision.',
    price: 129.99,
    brand: 'SafeHome',
    category: {
      name: 'Security',
      subCategories: ['Cameras', 'Accessories'],
    },
    inStock: true,
    rating: 3,
    images: ['White', 'Black'].map((color) => ({
      color,
      colorCode: color === 'White' ? '#FFFFFF' : '#000000',
      views: {
        front: '/product-image/security-camera.png',
        side: '/product-image/security-camera.png',
        back: '/product-image/security-camera.png',
      },
    })),
  },
  {
    id: '9',
    name: 'Electric Standing Desk',
    description:
      'Adjustable height electric standing desk for home or office use.',
    price: 299.99,
    brand: 'ErgoWorks',
    category: {
      name: 'Furniture',
      subCategories: ['Office', 'Home'],
    },
    inStock: true,
    rating: 3,
    images: ['Walnut', 'Black'].map((color) => ({
      color,
      colorCode: color === 'Walnut' ? '#5D3A1A' : '#000000',
      views: {
        front:
          'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg',
        side: 'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg',
        back: 'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg',
      },
    })),
  },
  {
    id: '10',
    name: 'Wireless Charging Pad',
    description:
      'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 29.99,
    brand: 'ChargeIt',
    category: {
      name: 'Accessories',
      subCategories: ['Chargers', 'Accessories'],
    },
    inStock: true,
    rating: 3,
    images: ['Black', 'White'].map((color) => ({
      color,
      colorCode: color === 'White' ? '#FFFFFF' : '#000000',
      views: {
        front:
          'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg',
        side: 'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg',
        back: 'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg',
      },
    })),
  },
  {
    id: '12',
    name: 'Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting.',
    price: 49.99,
    brand: 'GameGear',
    category: {
      name: 'Accessories',
      subCategories: ['Mice', 'Accessories'],
    },
    inStock: true,
    rating: 5,
    images: ['Black', 'Red'].map((color) => ({
      color,
      colorCode: color === 'Red' ? '#FF0000' : '#000000',
      views: {
        front:
          'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
        side: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
        back: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
      },
    })),
  },
  {
    id: '13',
    name: 'External SSD',
    description:
      '1TB external SSD with fast data transfer speeds and compact design.',
    price: 99.99,
    brand: 'FastDrive',
    category: {
      name: 'Storage',
      subCategories: ['External Drives', 'Accessories'],
    },
    inStock: true,
    rating: 3,
    images: ['Silver', 'Black'].map((color) => ({
      color,
      colorCode: color === 'Silver' ? '#C0C0C0' : '#000000',
      views: {
        front:
          'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
        side: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
        back: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      },
    })),
  },
]

export default products
