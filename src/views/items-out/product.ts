// data/products.ts

export const dummyProducts = [
  {
    id: 1,
    name: 'Kopi Arabika',
    description: 'Kopi arabika dengan cita rasa khas pegunungan.',
    price: 25000,
    stock: 10,
    url_image: 'https://source.unsplash.com/100x100/?coffee,arabica',
    base_unit: { unit_id: 1, unit_symbol: 'pcs' },
    conversions: [
      {
        from_unit: { unit_id: 2, unit_symbol: 'pak' },
        to_unit: { unit_id: 1, unit_symbol: 'pcs' },
        conversion_value: 10
      },
      {
        from_unit: { unit_id: 3, unit_symbol: 'dus' },
        to_unit: { unit_id: 1, unit_symbol: 'pcs' },
        conversion_value: 20
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
    base_unit: { unit_id: 1, unit_symbol: 'pcs' },
    conversions: []
  }
]
