import { Role } from "./role";

export interface User {
    id?: number,
    nome?: string,
    cognome?: string,
    dataDiNascita?: any,
    username?: string,
    password?: string,
    token?: string,
    ruolo?: Role
}
