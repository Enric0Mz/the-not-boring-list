exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    username: {
      type: "varchar(100)",
      notNull: true,
    },
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  });
};
