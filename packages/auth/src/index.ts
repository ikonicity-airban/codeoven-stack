export type Role = "user" | "admin";

const order: Record<Role, number> = { user: 0, admin: 1 };

/** True when `role` meets or exceeds `required`. */
export const hasRole = (role: Role | undefined, required: Role) =>
  role ? order[role] >= order[required] : false;
