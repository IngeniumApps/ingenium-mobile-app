import { z } from "zod";

export type FormData = z.infer<typeof zodSchema>;

// TODO: Actually validate the form data with zod in a minimal way for input validation before sending it to the backend
// Later, we can add more complex validation rules
// e.g. validation with regex for username like "vn.nachname" or "nachname.vn" or others
// We have to wait for the backend to know the exact validation rules

export const zodSchema = z.object({
  username: z.string().nonempty("Der Benutzername darf nicht leer sein."),
  password: z.string().nonempty("Das Passwort darf nicht leer sein."),
});
