import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { BOOKING_STATUS } from '../utils/constants';
import { generateId } from '../utils/helpers';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const trackingSubsRef = useRef({});

  const addBooking = (payload) => {
    const newBooking = { id: generateId('booking'), status: BOOKING_STATUS.PENDING, createdAt: new Date().toISOString(), ...payload };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBooking = (id, updates) => setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

  const startLiveTracking = async (bookingId) => {
    if (!bookingId) throw new Error('bookingId is required');
    if (trackingSubsRef.current[bookingId]) return;

    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Location permission denied.');
    }

    updateBooking(bookingId, {
      liveTracking: true,
      status: BOOKING_STATUS.ACTIVE,
      liveLocation: {
        ...(bookings.find((b) => b.id === bookingId)?.liveLocation || {}),
        trackingStartedAt: new Date().toISOString(),
      },
    });

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 7000,
        distanceInterval: 10,
      },
      async (position) => {
        const latitude = Number(position?.coords?.latitude || 0);
        const longitude = Number(position?.coords?.longitude || 0);
        let place = '';
        try {
          const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
          const g = geo?.[0] || {};
          place = [g.district || g.street || g.name || '', g.city || g.subregion || '', g.region || '']
            .filter(Boolean)
            .join(', ');
        } catch {
          // Keep coordinates even if reverse geocode fails.
        }
        updateBooking(bookingId, {
          liveLocation: {
            latitude,
            longitude,
            place,
            updatedAt: new Date().toISOString(),
          },
        });
      }
    );

    trackingSubsRef.current[bookingId] = sub;
  };

  const stopLiveTracking = (bookingId) => {
    const sub = trackingSubsRef.current[bookingId];
    if (sub) {
      sub.remove();
      delete trackingSubsRef.current[bookingId];
    }
    updateBooking(bookingId, {
      liveTracking: false,
      liveLocation: {
        ...(bookings.find((b) => b.id === bookingId)?.liveLocation || {}),
        trackingStoppedAt: new Date().toISOString(),
      },
    });
  };

  useEffect(
    () => () => {
      Object.values(trackingSubsRef.current).forEach((sub) => sub?.remove?.());
      trackingSubsRef.current = {};
    },
    []
  );

  const value = useMemo(
    () => ({ bookings, addBooking, updateBooking, startLiveTracking, stopLiveTracking }),
    [bookings]
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
