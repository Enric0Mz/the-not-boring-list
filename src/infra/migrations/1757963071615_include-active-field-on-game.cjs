exports.up = (pgm) => {
  pgm.addColumns("contents_users", {
    active: {
      type: "Boolean",
      default: true,
    },
  });
};
