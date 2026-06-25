import { resetPassword } from "modules/auth/auth.service";

export const message = {
  email: {
    register: "Go to restaurant management.",
    registerDetails:
      "Your account is ready. Start exploring restaurants, saving favorites, and booking tables in seconds.",
  },
  success: {
    addDish: "Dish added successfully",
    restaurant: {
      fetch: "Restaurants list fetched successfully",
      add: "Restaurant added successfully",
      detail: "Restaurant details fetched successfully",
    },
    user: {
      registerSuccess: "User registered successfully",
      loginSuccess: "User loggedin successfully",
      forgotPasswordLink:
        "A reset link has been sent to your registered email.",
      resetPassword: "Password has been reset successfully.",
    },
  },
  failed: {
    restaurantNotFound: "Restaurant not found for given id",
    user: {
      notFound: "User with email associated not found.",
      incorrectPassword: "Password provided is incorrect",
      emailAlreadtExists:
        "Provided email is already used. Please use another email",
      resetPasswordTokenExpired:
        "Reset password token expired. Please try forgot password again.",
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
    user: {
      name: {
        required: "Name is required",
        min: "Name must have atleast 3 letters",
        invalid: "Please enter valid name",
      },
      email: {
        invalid: "Please enter valid email",
      },
      password: {
        notMatch: "Passwords do not match",
        token: "Invalid token. Please try again.",
        required: "Password is required",
        invalid:
          "Password must contain uppercase, lowercase, number, and special character, and be at least 8 characters long.",
      },
    },
  },
};
