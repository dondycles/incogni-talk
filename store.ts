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
  username: string | null;
  setUserName: (username: string | null) => void;
};

export const useUserData = create<UserData>()((set) => ({
  username: null,
  setUserName: (username) => set((state) => ({ username: username })),
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
