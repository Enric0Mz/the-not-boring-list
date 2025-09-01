exports.up = (pgm) => {
  pgm.addColumns("games", {
    platform: {
      type: "varchar(50)",
    },
  });
};
