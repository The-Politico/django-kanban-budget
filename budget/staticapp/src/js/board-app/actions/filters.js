import * as types from '../constants/actions';

export const addFilterDeveloper = id => ({
  type: types.ADD_FILTER_DEVELOPER,
  id,
});

export const removeFilterDeveloper = id => ({
  type: types.REMOVE_FILTER_DEVELOPER,
  id,
});

export const addFilterType = slug => ({
  type: types.ADD_FILTER_TYPE,
  slug,
});

export const removeFilterType = slug => ({
  type: types.REMOVE_FILTER_TYPE,
  slug,
});

export const setFilterDateRange = (startDate, endDate) => ({
  type: types.SET_FILTER_DATE_RANGE,
  startDate,
  endDate,
});

export const resetFilters = () => ({
  type: types.RESET_FILTERS,
});
