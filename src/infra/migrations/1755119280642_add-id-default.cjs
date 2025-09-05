exports.up = (pgm) => {
  (pgm.alterColumn("users", "id", {
    default: pgm.func("gen_random_uuid()"),
  }),
    pgm.alterColumn("sessions", "id", {
      default: pgm.func("gen_random_uuid()"),
    }));
};
