import { useEffect, useState } from 'react';
import { getAverageSalesByDay, getMostSoldCategoriesByDate, getMostSoldProductsByDate, getOrdersByDays, getPopularRestaurantByDate } from '../controller/controller';

export const useAdminCharts = () => {
  const [popularRestaurants, setPopularRestaurants] = useState(null);
  const [ordersByDays, setOrdersByDays] = useState(null);
  const [averageSalesByDay, setAverageSalesByDay] = useState(null);
  const [mostSoldProducts, setMostSoldProducts] = useState(null);
  const [mostSoldCategories, setMostSoldCategories] = useState(null);
  useEffect(() => {
    let active = true;
    const date = new Date().toISOString().split('T')[0];
    for (const [request, update] of [
      [getPopularRestaurantByDate(date), setPopularRestaurants],
      [getOrdersByDays(), setOrdersByDays],
      [getAverageSalesByDay(), setAverageSalesByDay],
      [getMostSoldProductsByDate(date), setMostSoldProducts],
      [getMostSoldCategoriesByDate(date), setMostSoldCategories],
    ]) request.then(({ data }) => { if (active) update(data); }).catch(console.error);
    return () => { active = false; };
  }, []);
  return { popularRestaurants, ordersByDays, averageSalesByDay, mostSoldProducts, mostSoldCategories };
};
