export default {
  header: {
    main: [
      {
        id: "home",
        route: "/",
        title: "shared.layout.header.menu.home",
      },
      {
        id: "all-products-menu",
        route: { name: "Catalog" },
        title: "shared.layout.header.menu.all_products",
      },
      {
        id: "bulk-order",
        route: { name: "BulkOrder" },
        title: "shared.layout.header.menu.bulk",
      },
      {
        id: "compare",
        route: { name: "CompareProducts" },
        title: "shared.layout.header.menu.compare",
      },
      {
        id: "checkout",
        route: { name: "Checkout" },
        title: "shared.layout.header.menu.cart",
      },
      {
        id: "contact",
        route: "/contact",
        title: "shared.layout.header.menu.contact_us",
      },
    ],
  },
  footer: [],
};
