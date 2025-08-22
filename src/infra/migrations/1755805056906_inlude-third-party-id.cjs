exports.up = (pgm) => {
  pgm.addColumns("contents", {
    third_party_id: {
      type: "integer",
    },
  });
};
