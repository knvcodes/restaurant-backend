import { IRestaurant } from "./restaurant.model";

export const toRestaurantResponseDto = (restaurantObj: IRestaurant) => ({
  id: restaurantObj._id.toString(),
  restaurantId: restaurantObj.restaurant_id,
  name: restaurantObj.name,
  borough: restaurantObj.borough,
  cuisine: restaurantObj.cuisine,
  description: restaurantObj.description,

  address: {
    building: restaurantObj.address.building,
    coord: restaurantObj.address.coord,
    street: restaurantObj.address.street,
    zipcode: restaurantObj.address.zipcode,
  },

  deliveryHours: {
    from: restaurantObj.deliveryHours.from,
    to: restaurantObj.deliveryHours.to,
  },

  openDays: {
    from: restaurantObj.openDays.from,
    to: restaurantObj.openDays.to,
  },

  deliveryFee: restaurantObj.deliveryFee,
  cancellationFee: restaurantObj.cancellationFee,
  minimumDelivery: restaurantObj.minimumDelivery,

  grades: restaurantObj.grades,

  createdAt: restaurantObj.createdAt,
  updatedAt: restaurantObj.updatedAt,
});
