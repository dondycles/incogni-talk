import { create } from "zustand";
import { persist } from "zustand/middleware";
type OptimisticPost = {
  data: any[any] | null | undefined;
  setData: (content: any[any] | null | undefined) => void;
};

export const useOptimisticPost = create<OptimisticPost>()((set) => ({
  data: null,
  setData: (data) => set((state) => ({ data: data })),
}));
type UserData = {
  username: string | null | undefined;
  id: string | null | undefined;
  created_at: string | null | undefined;
  setData: (
    username: string | null | undefined,
    id: string | null | undefined,
    created_at: string | null | undefined
  ) => void;
};

export const useUserData = create<UserData>()((set) => ({
  username: null,
  id: null,
  created_at: null,
  setData: (username, id, created_at) =>
    set((state) => ({ username: username, id: id, created_at: created_at })),
}));

type OptimisticComent = {
  data: any[any] | null | undefined;
  setData: (content: any[any] | null | undefined) => void;
};

export const useOptimisticComent = create<OptimisticComent>()((set) => ({
  data: null,
  setData: (data) => set((state) => ({ data: data })),
}));

type OptimisticUgComment = {
  data: any[any] | null | undefined;
  setData: (content: any[any] | null | undefined) => void;
};

export const useOptimisticUgComment = create<OptimisticUgComment>()((set) => ({
  data: null,
  setData: (data) => set((state) => ({ data: data })),
}));
