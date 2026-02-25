import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../middleware/api";

export const useAuth = () => {
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isFetching: userRefetchLoading,
  } = useQuery<UserType | null, AxiosError>({
    queryFn: async () => {
      try {
        await api.get("/sanctum/csrf-cookie");
        const res = await api.get("/api/user");

        return res.data as UserType;
      } catch (e) {
        const error = e as AxiosError;
        console.error(error);
        return null;
      }
    },
    queryKey: ["login-key"],
    staleTime: 1000 * 60 * 1,
  });

  const login = async (data: LoginType): Promise<UserType | null> => {
    try {
      await api.get("/sanctum/csrf-cookie");

      const res = await api.post("/api/login", data);

      if (!res.data) return null;

      return res.data as UserType;
    } catch (e) {
      const error = e as AxiosError;
      console.error(error);
      return null;
    }
  };

  return {
    user,
    userLoading,
    refetchUser,
    userRefetchLoading,
    login,
  };
};

type UserType = {
  id: number;
  email: string;
  name: string;
};

export type LoginType = {
  email: string;
  password: string;
};
