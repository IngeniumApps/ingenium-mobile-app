import { z } from "zod";

export type FormData = z.infer<typeof zodSchema>;

// validation for vn.nachname and others ? waiting for backend

export const zodSchema = z.object({
  username: z.string().nonempty("Der Benutzername darf nicht leer sein."),
  password: z.string().nonempty("Das Passwort darf nicht leer sein."),
});
