import React from "react";

export const apiPath = {
  createUser: "users/create",
  login: "users/login",
  refreshToken: "users/refresh",
  userById: "users/",
  editUser: "users/edit/",

  getProducts: "products",
  getProductsById: "products/",
  getPopularProducts: "products/popular",

  getCategory: "category",

  addToWishlist: "wishlist/add",
  getWishlist: "wishlist",
  removeWishlist: "wishlist/remove",

  addToCart: "cart/add",
  getCart: "cart",
  removeFromCart: "cart/remove",
  updateCartQuantity: "cart/update-quantity",
  validateCheckout: "cart/validate",

  getAddresses: "address",
  createAddress: "address/create",
  deleteAddress: "address/delete/",

  createOrder: "order/create",
  getOrders: "order",
  getOrderById: "order/",
  createPaymentIntent: "order/create-payment-intent",
  orderByPaymentIntent: "order/payment/",

  getReviews: "review/",
  createReview: "review/create",
  updateReview: "review/update",
  deleteReview: "review/delete/",
};
