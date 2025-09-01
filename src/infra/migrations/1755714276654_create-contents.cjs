exports.up = (pgm) => {
  pgm.createType("content_type_enum", ["game", "movie", "book", "tv_show"]);

  pgm.createTable("contents", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    image: {
      type: "varchar(2048)",
    },
    score: {
      type: "integer",
    },
    description: {
      type: "TEXT",
    },
    content_type: {
      type: "content_type_enum",
      notNull: true,
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
