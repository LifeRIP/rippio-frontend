import { useEffect, useState } from 'react';
import { getRestaurantsPagination, putUserState } from '@/api/admin';

export const useRestaurantManagementCities = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const limit = 10;
  const cities = selectedDepartamento?.ciudades.map(ciudad => ({ value: ciudad, label: ciudad })) || [];
  const handleSelectDepartamentos = departamento => setSelectedDepartamento(departamento);
  const handleSelectCity = city => { setPage(1); setSelectedCity(city); setLoading(Boolean(city)); };
  const handleNextPage = e => { e.preventDefault(); if (page < pages) { setLoading(true); setPage(page + 1); } };
  const handlePrevPage = e => { e.preventDefault(); if (page > 1) { setLoading(true); setPage(page - 1); } };
  const handleSwitchState = async (e, id) => {
    e.stopPropagation();
    setRestaurants(current => current.map(restaurant => restaurant.id === id ? { ...restaurant, estado: !restaurant.estado } : restaurant));
    await putUserState(id);
  };
  useEffect(() => {
    if (!selectedCity) return;
    let active = true;
    getRestaurantsPagination(selectedCity.value, (page - 1) * limit, limit)
      .then(({ data }) => { if (active) { setRestaurants(data.restaurants); setPages(data.totalPages); } })
      .catch(console.error).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, selectedCity]);
  return { cities, handleSelectDepartamentos, handleSelectCity, restaurants, handleNextPage, handlePrevPage, page, pages, loading, handleSwitchState };
};
