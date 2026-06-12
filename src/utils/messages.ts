export const message = {
  success: {
    addDish: "Dish added successfully",
    restaurant: {
      fetch: "Restaurants list fetched successfully",
      add: "Restaurant added successfully",
      detail: "Restaurant details fetched successfully",
    },
    owner: {
      registerSuccess: "Owner registered successfully",
      loginSuccess: "Owner loggedin successfully",
    },
  },
  failed: {
    restaurantNotFound: "Restaurant not found for given id",
    owner: {
      notFound: "Owner with email associated not found.",
      incorrectPassword: "Password provided is incorrect",
    },
  },
  validation: {
    addDish: {
      name: {
        required: "Dish name is required",
        minLength: "Dish name must be at least 1 character",
      },
      description: {
        invalid: "Description must be a string",
      },
      isActive: {
        invalid: "isActive must be a boolean",
      },
      tags: {
        invalid: "Tags must be an array of strings",
      },
      metadata: {
        invalid: "Metadata must be an object",
      },
      supplements: {
        invalid: "Supplements must be an array of strings",
      },
      serving: {
        invalid: "Serving must be an array",
        title: {
          required: "Serving title is required",
          invalid: "Serving title must be a string",
        },
        value: {
          required: "Serving value is required",
          invalid: "Serving value must be a number",
        },
        price: {
          required: "Serving price is required",
          invalid: "Serving price must be a number",
        },
        currency: {
          required: "Serving currency is required",
          invalid: "Serving currency must be a string",
        },
      },
      restaurantId: {
        invalid: "Restaurant ID must be a valid string",
      },
    },
    owner: {
      name: {
        required: "Name is required",
        min: "Name must have atleast 3 letters",
        invalid: "Please enter valid name",
      },
      email: {
        invalid: "Please enter valid email",
      },
      password: {
        required: "Password is required",
        invalid:
          "Password must contain uppercase, lowercase, number, and special character, and be at least 8 characters long.",
      },
    },
  },
};
