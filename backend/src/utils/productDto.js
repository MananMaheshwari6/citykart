export function productToClient(doc) {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  return {
    id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    category: p.category,
    shopId: p.shopId,
    cityId: p.cityId,
    rating: p.rating,
    inStock: p.inStock,
  };
}
