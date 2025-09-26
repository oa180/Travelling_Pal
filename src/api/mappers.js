// Map backend Offer (Swagger /offers) to frontend TravelPackage shape
// Backend example fields (from CreateOfferDto):
// { id?, title, description, price, seats, startDate, endDate, destination, kind, companyId }

export function mapOfferToTravelPackage(offer) {
  if (!offer || typeof offer !== "object") return null;
  const fallbackImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop";
  const derivedImage =
    offer.image_url ??
    offer.imageUrl ??
    offer.image ??
    (Array.isArray(offer.galleryImages) ? offer.galleryImages[0] : undefined) ??
    (Array.isArray(offer.images) ? offer.images[0] : undefined) ??
    undefined;
  return {
    id: String(offer.id ?? offer.offerId ?? ""),
    title: offer.title ?? "",
    destination: offer.destination ?? "",
    description: offer.description ?? "",
    price: Number(offer.price ?? offer.originalPrice ?? 0),
    // derive additional UI fields with safe fallbacks
    original_price: offer.original_price ?? undefined,
    image_url: derivedImage || fallbackImage,
    available_dates: Array.isArray(offer.available_dates)
      ? offer.available_dates
      : (offer.startDate && offer.endDate)
        ? [offer.startDate, offer.endDate]
        : (Array.isArray(offer.availableDates) ? offer.availableDates : []),
    duration_days: offer.duration_days ?? offer.durationDays ?? undefined,
    star_rating: Number(offer.star_rating ?? offer.starRating ?? 4.5),
    transport_type: offer.transport_type ?? offer.transportType ?? undefined,
    accommodation_level: offer.accommodation_level ?? offer.accommodationLevel ?? undefined,
    max_travelers: offer.seats ?? offer.max_travelers ?? offer.maxTravelers ?? undefined,
    includes: Array.isArray(offer.includes) ? offer.includes : undefined,
    provider_id: offer.providerId
      ? String(offer.providerId)
      : offer.company?.id != null
      ? String(offer.company.id)
      : (offer.companyId != null ? String(offer.companyId) : (offer.provider_id ?? undefined)),
    provider_name: offer.providerName ?? offer.company?.name ?? offer.companyName ?? offer.provider_name ?? undefined,
    country: offer.country ?? undefined,
    continent: offer.continent ?? undefined,
  };
}

export function mapOffersListToTravelPackages(data) {
  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];
  return items.map(mapOfferToTravelPackage).filter(Boolean);
}
