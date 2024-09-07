import { atom } from 'jotai'
export const userAtom = atom<any>('')
export const orgTreeAtom = atom<any>([])
export const refreshLayoutAtom = atom(false);
