exports.up = (pgm) => {
  pgm.createType("content_status", [
    "not_started",
    "in_progress",
    "concluded",
    "on_hold",
    "dropped",
    "plan_to_play",
  ]);

  pgm.createTable("contents_users", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    personal_score: {
      type: "integer",
    },
    personal_notes: {
      type: "TEXT",
    },
    hours_invested: {
      type: "integer",
    },
    status: {
      type: "content_status",
    },
    content_id: {
      type: "uuid",
      notNull: true,
      references: '"contents"',
      onDelete: "SET NULL",
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
