import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import driversReducer from './slices/driversSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import appsettingsReducer from './slices/appsettingsSlice';
import usersReducer from './slices/usersSlices';
import statsReducer from './slices/statsSlice';
import countriesReducer from './slices/countriesSlice';
import cityReducer from './slices/citySlice'
import schoolReducer from './slices/schoolSlices'
import tripGroupsReducer from './slices/groupsSlice';
import tripsReducer from './slices/tripsSlices';
import vehicleReducer from './slices/vehicleSlice';
import toastReducer from './slices/toastSlice';
import contactUsReducer from './slices/contactUsSlice';
import languageReducer from './slices/languageSlice';
import notificationsReducer from './slices/notificationsSlice';
import adsReducer from './slices/adsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    ui: uiReducer,
    drivers: driversReducer,
    subscription: subscriptionReducer,
    appsettings: appsettingsReducer,
    users: usersReducer,
    stats: statsReducer,
    countries: countriesReducer,
    city:cityReducer,
    school:schoolReducer,
    tripGroups: tripGroupsReducer,
    trips: tripsReducer,
    vehicle: vehicleReducer,
    toast: toastReducer,
    contactUs: contactUsReducer,
    language: languageReducer,
    notifications: notificationsReducer,
    ads: adsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
