exports.up = (pgm) => {
  pgm.alterColumn("contents", "id", {
    default: pgm.func("gen_random_uuid()"),
  }),
    pgm.alterColumn("games", "id", {
      default: pgm.func("gen_random_uuid()"),
    }),
    pgm.alterColumn("contents_users", "id", {
      default: pgm.func("gen_random_uuid()"),
    });
};
