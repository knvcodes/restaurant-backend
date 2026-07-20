import { IDishes } from "../dishes/dishes.model.js";
import { IRestaurant } from "../restaurants/restaurant.model.js";

interface restaurantObj extends IRestaurant {
  dishes?: IDishes[];
}

export const toRestaurantResponseDto = (restaurantObj: restaurantObj) => ({
  id: restaurantObj._id.toString(),
  restaurantId: restaurantObj.restaurant_id,
  name: restaurantObj.name,

  views: restaurantObj.stats.totalViews,

  createdAt: restaurantObj.createdAt,
  updatedAt: restaurantObj.updatedAt,
});
