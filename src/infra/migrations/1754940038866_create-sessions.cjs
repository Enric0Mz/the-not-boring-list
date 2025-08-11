exports.up = (pgm) => {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    token: {
      type: "varchar(96)", // generated with crypto randomBytes(48)
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
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
