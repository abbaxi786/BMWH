"use client";

import { useEffect, useState } from "react";
import {
  FaCalendarDays,
  FaClock,
  FaLocationDot,
} from "react-icons/fa6";

interface Schedule {
  id: number;
  doctor_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location: string | null;
  is_available: boolean;
}

interface DoctorScheduleProps {
  doctorId: number | string;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DoctorSchedule({
  doctorId,
}: DoctorScheduleProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `/api/schedule?doctor_id=${doctorId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const result = await response.json();

        setSchedules(result.data || []);
      } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [doctorId]);

  const getSchedulesForDay = (day: string) => {
    return schedules.filter(
      (schedule) =>
        schedule.day_of_week.toLowerCase() === day.toLowerCase()
    );
  };

  if (loading) {
    return (
      <section className="mt-10">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />

          <div>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-10">
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            Unable to load doctor schedule.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">

      {/* Header */}
      <div className="mb-7 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#911824]/10">
          <FaCalendarDays className="text-xl text-[#911824]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Doctor&apos;s Schedule
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultation hours and availability
          </p>
        </div>
      </div>

      {/* Schedule */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {DAYS.map((day) => {
          const daySchedules = getSchedulesForDay(day);

          const isAvailable = daySchedules.some(
            (schedule) => schedule.is_available
          );

          return (
            <div
              key={day}
              className={`rounded-xl border p-5 transition ${
                isAvailable
                  ? "border-gray-200 bg-white hover:border-[#911824]/30 hover:shadow-sm"
                  : "border-gray-100 bg-gray-50"
              }`}
            >

              {/* Day Header */}
              <div className="mb-4 flex items-center justify-between">

                <h3
                  className={`font-bold ${
                    isAvailable
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {day}
                </h3>

                {isAvailable ? (
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500">
                    Closed
                  </span>
                )}

              </div>

              {/* Time Slots */}
              {daySchedules.length > 0 ? (
                <div className="space-y-3">

                  {daySchedules.map((schedule) => {

                    if (!schedule.is_available) {
                      return (
                        <div
                          key={schedule.id}
                          className="text-sm text-gray-400"
                        >
                          Not available
                        </div>
                      );
                    }

                    return (
                      <div
                        key={schedule.id}
                        className="space-y-2"
                      >

                        {/* Time */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#911824]">
                          <FaClock className="text-xs" />

                          <span>
                            {formatTime(schedule.start_time)}
                            {" - "}
                            {formatTime(schedule.end_time)}
                          </span>
                        </div>

                        {/* Location */}
                        {schedule.location && (
                          <div className="flex items-start gap-2 text-xs text-gray-500">
                            <FaLocationDot className="mt-0.5 shrink-0 text-gray-400" />

                            <span>
                              {schedule.location}
                            </span>
                          </div>
                        )}

                      </div>
                    );
                  })}

                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No consultation hours
                </p>
              )}

            </div>
          );
        })}

      </div>

      {/* Note */}
      <div className="mt-5 rounded-lg bg-gray-50 px-5 py-4">
        <p className="text-sm leading-6 text-gray-500">
          <span className="font-semibold text-gray-700">
            Please note:
          </span>{" "}
          Consultation hours may change. Please contact the hospital
          before visiting to confirm the doctor&apos;s availability.
        </p>
      </div>

    </section>
  );
}