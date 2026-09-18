"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FiEdit2,
  FiEye,
  FiTrash2,
  FiUsers,
  FiMapPin,
  FiX,
} from "react-icons/fi";

// ============================================================
// TYPES
// ============================================================

export interface EventGuest {
  id: number;
  event_id: number;
  name: string;
  designation: string | null;
  organization: string | null;
  photo_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: number;
  title: string;
}

interface EventsResponse {
  success: boolean;
  data: Event[];
  message?: string;
}

interface GuestsResponse {
  success: boolean;
  data: EventGuest[];
  message?: string;
}

interface EventGuestListProps {
  onEdit?: (guest: EventGuest) => void;
}

// ============================================================
// COMPONENT
// ============================================================

function EventGuests({
  onEdit,
}: EventGuestListProps) {
  // ----------------------------------------------------------
  // STATES
  // ----------------------------------------------------------

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] =
    useState<string>("");

  const [guests, setGuests] = useState<EventGuest[]>([]);

  const [loadingEvents, setLoadingEvents] =
    useState(true);

  const [loadingGuests, setLoadingGuests] =
    useState(false);

  const [error, setError] = useState("");

  const [selectedGuest, setSelectedGuest] =
    useState<EventGuest | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // ----------------------------------------------------------
  // FETCH EVENTS
  // ----------------------------------------------------------

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setError("");

        const response =
          await axios.get<EventsResponse>(
            "/api/events/all"
          );

        if (response.data.success) {
          const eventList = response.data.data;

          setEvents(eventList);

          // Automatically select first event
          if (eventList.length > 0) {
            setSelectedEventId(
              String(eventList[0].id)
            );
          }
        } else {
          setError(
            response.data.message ||
              "Failed to load events."
          );
        }
      } catch (err) {
        console.error(
          "Error fetching events:",
          err
        );

        setError(
          "Failed to load events. Please refresh the page."
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // ----------------------------------------------------------
  // FETCH GUESTS
  // ----------------------------------------------------------

  useEffect(() => {
    if (!selectedEventId) {
      setGuests([]);
      return;
    }

    const fetchGuests = async () => {
      try {
        setLoadingGuests(true);
        setError("");

        const response =
          await axios.get<GuestsResponse>(
            `/api/events/guests?event_id=${selectedEventId}`
          );

        if (response.data.success) {
          setGuests(response.data.data);
        } else {
          setError(
            response.data.message ||
              "Failed to load guests."
          );

          setGuests([]);
        }
      } catch (err) {
        console.error(
          "Error fetching event guests:",
          err
        );

        setError(
          "Failed to load event guests."
        );

        setGuests([]);
      } finally {
        setLoadingGuests(false);
      }
    };

    fetchGuests();
  }, [selectedEventId]);

  // ----------------------------------------------------------
  // DELETE GUEST
  // ----------------------------------------------------------

  const handleDelete = async (
    guest: EventGuest
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${guest.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(guest.id);
      setError("");

      const response =
        await axios.delete(
          "/api/events/guests",
          {
            data: {
              id: guest.id,
            },
          }
        );

      if (response.data.success) {
        setGuests((previous) =>
          previous.filter(
            (item) => item.id !== guest.id
          )
        );

        // Close view modal if deleted guest was open
        if (
          selectedGuest?.id === guest.id
        ) {
          setSelectedGuest(null);
        }
      } else {
        setError(
          response.data.message ||
            "Failed to delete guest."
        );
      }
    } catch (err: any) {
      console.error(
        "Error deleting guest:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to delete guest."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ----------------------------------------------------------
  // SELECTED EVENT
  // ----------------------------------------------------------

  const selectedEvent = events.find(
    (event) =>
      String(event.id) === selectedEventId
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full">

      {/* ====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#5B403D]">
            Event Guests
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage guests and special attendees for
            your events.
          </p>
        </div>

        {/* Event Selector */}

        <div className="w-full lg:w-80">

          <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
            Select Event
          </label>

          <select
            value={selectedEventId}
            onChange={(e) =>
              setSelectedEventId(e.target.value)
            }
            disabled={
              loadingEvents || loadingGuests
            }
            className="
              select
              select-bordered
              w-full
              border-gray-300
              bg-white
              focus:border-[#911824]
              focus:outline-none
            "
          >
            {loadingEvents ? (
              <option value="">
                Loading events...
              </option>
            ) : events.length === 0 ? (
              <option value="">
                No events available
              </option>
            ) : (
              <>
                <option value="">
                  Select an event
                </option>

                {events.map((event) => (
                  <option
                    key={event.id}
                    value={event.id}
                  >
                    {event.title}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* ====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-3"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* ====================================================
          SELECTED EVENT INFO
      ===================================================== */}

      {selectedEvent && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(145,24,36,.08)]">
            <FiUsers
              className="text-[#911824]"
              size={19}
            />
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Guests for
            </p>

            <p className="font-medium text-[#5B403D]">
              {selectedEvent.title}
            </p>
          </div>

          <div className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {guests.length}{" "}
            {guests.length === 1
              ? "Guest"
              : "Guests"}
          </div>
        </div>
      )}

      {/* ====================================================
          LOADING
      ===================================================== */}

      {loadingGuests && (
        <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col items-center gap-3">

            <span className="loading loading-spinner loading-md text-[#911824]" />

            <p className="text-sm text-gray-500">
              Loading guests...
            </p>
          </div>
        </div>
      )}

      {/* ====================================================
          NO EVENT
      ===================================================== */}

      {!loadingGuests &&
        !selectedEventId && (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(145,24,36,.08)]">
              <FiUsers
                className="text-2xl text-[#911824]"
              />
            </div>

            <h3 className="font-medium text-[#5B403D]">
              Select an event
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Select an event above to view its
              guests.
            </p>
          </div>
        )}

      {/* ====================================================
          EMPTY
      ===================================================== */}

      {!loadingGuests &&
        selectedEventId &&
        guests.length === 0 && (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(145,24,36,.08)]">
              <FiUsers
                className="text-2xl text-[#911824]"
              />
            </div>

            <h3 className="font-medium text-[#5B403D]">
              No guests found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              This event does not have any guests yet.
            </p>
          </div>
        )}

      {/* ====================================================
          DESKTOP TABLE
      ===================================================== */}

      {!loadingGuests &&
        guests.length > 0 && (
          <>

            <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="border-b border-gray-200 bg-gray-50">

                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Guest
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Designation
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Organization
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {guests.map((guest) => (
                      <tr
                        key={guest.id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* Guest */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            {guest.photo_url ? (
                              <img
                                src={guest.photo_url}
                                alt={guest.name}
                                className="h-11 w-11 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(145,24,36,.08)]">
                                <FiUsers
                                  className="text-[#911824]"
                                  size={18}
                                />
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-[#5B403D]">
                                {guest.name}
                              </p>

                              {guest.description && (
                                <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                                  {guest.description}
                                </p>
                              )}
                            </div>

                          </div>
                        </td>

                        {/* Designation */}

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {guest.designation || "—"}
                        </td>

                        {/* Organization */}

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {guest.organization || "—"}
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            {/* View */}

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedGuest(
                                  guest
                                )
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                text-gray-500
                                transition
                                hover:border-[#911824]
                                hover:text-[#911824]
                              "
                              title="View guest"
                            >
                              <FiEye size={16} />
                            </button>

                            {/* Edit */}

                            <button
                              type="button"
                              onClick={() =>
                                onEdit?.(guest)
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                text-gray-500
                                transition
                                hover:border-[#911824]
                                hover:text-[#911824]
                              "
                              title="Edit guest"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(guest)
                              }
                              disabled={
                                deletingId ===
                                guest.id
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                text-gray-500
                                transition
                                hover:border-red-500
                                hover:text-red-600
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              title="Delete guest"
                            >
                              {deletingId ===
                              guest.id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 md:hidden">

              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >

                  {/* Guest Header */}

                  <div className="flex items-start gap-3">

                    {guest.photo_url ? (
                      <img
                        src={guest.photo_url}
                        alt={guest.name}
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgba(145,24,36,.08)]">
                        <FiUsers
                          className="text-[#911824]"
                          size={21}
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-[#5B403D]">
                        {guest.name}
                      </h3>

                      {guest.designation && (
                        <p className="mt-0.5 text-sm text-gray-500">
                          {guest.designation}
                        </p>
                      )}

                      {guest.organization && (
                        <p className="mt-1 text-xs text-gray-400">
                          {guest.organization}
                        </p>
                      )}

                    </div>
                  </div>

                  {/* Description */}

                  {guest.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                      {guest.description}
                    </p>
                  )}

                  {/* Actions */}

                  <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedGuest(guest)
                      }
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-gray-600
                        transition
                        hover:border-[#911824]
                        hover:text-[#911824]
                      "
                    >
                      <FiEye size={15} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit?.(guest)
                      }
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-gray-600
                        transition
                        hover:border-[#911824]
                        hover:text-[#911824]
                      "
                    >
                      <FiEdit2 size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(guest)
                      }
                      disabled={
                        deletingId === guest.id
                      }
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-gray-200
                        text-gray-500
                        transition
                        hover:border-red-500
                        hover:text-red-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {deletingId === guest.id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <FiTrash2 size={15} />
                      )}
                    </button>

                  </div>
                </div>
              ))}

            </div>
          </>
        )}

      {/* ====================================================
          VIEW MODAL
      ===================================================== */}

      {selectedGuest && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onClick={() =>
            setSelectedGuest(null)
          }
        >

          <div
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <h3 className="font-semibold text-[#5B403D]">
                Guest Details
              </h3>

              <button
                type="button"
                onClick={() =>
                  setSelectedGuest(null)
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >
                <FiX size={17} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="p-5">

              <div className="flex flex-col items-center text-center">

                {selectedGuest.photo_url ? (
                  <img
                    src={selectedGuest.photo_url}
                    alt={selectedGuest.name}
                    className="h-28 w-28 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[rgba(145,24,36,.08)]">
                    <FiUsers
                      className="text-4xl text-[#911824]"
                    />
                  </div>
                )}

                <h4 className="mt-4 text-lg font-semibold text-[#5B403D]">
                  {selectedGuest.name}
                </h4>

                {selectedGuest.designation && (
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedGuest.designation}
                  </p>
                )}

                {selectedGuest.organization && (
                  <p className="mt-1 text-sm text-gray-400">
                    {selectedGuest.organization}
                  </p>
                )}

              </div>

              {selectedGuest.description && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    {selectedGuest.description}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedGuest(null)
                }
                className="
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-50
                "
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventGuests;

