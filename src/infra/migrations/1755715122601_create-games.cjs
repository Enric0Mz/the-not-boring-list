exports.up = (pgm) => {
  pgm.createTable("games", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    publisher: {
      type: "varchar(100)",
    },
    hours_to_beat: {
      type: "integer",
    },
    content_id: {
      type: "uuid",
      notNull: true,
      references: '"contents"',
      onDelete: "SET NULL",
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
