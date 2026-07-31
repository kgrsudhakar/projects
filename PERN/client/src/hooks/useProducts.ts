import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useProducts = (params: { search?: string; categoryId?: string; skip?: number; take?: number }) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get('/cart');
      return data;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data } = await api.post('/cart/add', { productId, quantity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data } = await api.patch(`/cart/item/${productId}`, { quantity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/cart/item/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    cartQuery,
    addToCart: addToCartMutation.mutateAsync,
    updateQuantity: updateQuantityMutation.mutateAsync,
    removeFromCart: removeFromCartMutation.mutateAsync,
  };
};

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/me');
      return data;
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (shippingAddress: string) => {
      const { data } = await api.post('/orders/checkout', { shippingAddress });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    ordersQuery,
    checkout: checkoutMutation.mutateAsync,
  };
};
