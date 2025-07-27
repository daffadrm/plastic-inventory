// data/products.ts

export const dummyProducts = [
  {
    id: 1,
    name: 'Kopi Arabika',
    description: 'Kopi arabika dengan cita rasa khas pegunungan.',
    price: 25000,
    stock: 10,
    url_image: 'https://source.unsplash.com/100x100/?coffee,arabica',
    base_unit: { id: 1, name: 'pcs' },
    conversions: [
      {
        from_unit: { id: 2, name: 'pak' },
        to_unit: { id: 1, name: 'pcs' },
        multiplier: 10
      },
      {
        from_unit: { id: 3, name: 'dus' },
        to_unit: { id: 1, name: 'pcs' },
        multiplier: 20
      }
    ]
  },
  {
    id: 2,
    name: 'Teh Hijau',
    description: 'Teh hijau segar dari perkebunan alami.',
    price: 15000,
    stock: 8,
    url_image: 'https://source.unsplash.com/100x100/?tea,green',
    base_unit: { id: 1, name: 'pcs' },
    conversions: [
      {
        from_unit: { id: 2, name: 'pak' },
        to_unit: { id: 1, name: 'pcs' },
        multiplier: 5
      }
    ]
  }
]
