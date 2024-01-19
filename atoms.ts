import { UserThread } from "@prisma/client";
import { atom } from "jotai";

export const userThreadAtom = atom<UserThread | null>(null);
