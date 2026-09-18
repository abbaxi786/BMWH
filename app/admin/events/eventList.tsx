"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiEye,
  FiMapPin,
  FiStar,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export interface Event {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EventsResponse {
  success: boolean;
  data: Event[];
  message?: string;
}

interface EventsListProps {
  onEdit?: (event: Event) => void;
  onView?: (event: Event) => void;
}

function EventsList({
  onEdit,
  onView,
}: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Event selected for viewing
   */
  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);

  /*
   * DaisyUI dialog reference
   */
  const viewModalRef = useRef<HTMLDialogElement | null>(null);

  /*
   * Fetch events
   */
  const getEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<EventsResponse>(
        "/api/events/all"
      );

      setEvents(response.data.data || []);
    } catch (err: unknown) {
      console.error("Error fetching events:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to load events."
        );
      } else {
        setError("Failed to load events.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  /*
   * Open view modal
   */
  const handleView = (event: Event) => {
    setSelectedEvent(event);

    /*
     * Call parent's onView if provided
     */
    onView?.(event);

    /*
     * Open DaisyUI modal
     */
    setTimeout(() => {
      viewModalRef.current?.showModal();
    }, 0);
  };

  /*
   * Close modal
   */
  const closeViewModal = () => {
    viewModalRef.current?.close();
    setSelectedEvent(null);
  };

  /*
   * Delete event
   */
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await axios.delete("/api/events", {
        data: { id },
      });

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );
    } catch (err: unknown) {
      console.error("Delete event error:", err);

      if (axios.isAxiosError(err)) {
        alert(
          err.response?.data?.message ||
            "Failed to delete event."
        );
      } else {
        alert("Failed to delete event.");
      }
    }
  };

  /*
   * Toggle event active status
   */
  const handleToggleActive = async (event: Event) => {
    try {
      const data = new FormData();

      data.append("id", String(event.id));
      data.append("title", event.title);
      data.append(
        "description",
        event.description || ""
      );
      data.append("event_date", event.event_date);
      data.append(
        "start_time",
        event.start_time || ""
      );
      data.append(
        "end_time",
        event.end_time || ""
      );
      data.append(
        "location",
        event.location || ""
      );
      data.append(
        "is_featured",
        event.is_featured ? "true" : "false"
      );
      data.append(
        "is_active",
        event.is_active ? "false" : "true"
      );

      const response = await axios.put(
        "/api/events",
        data
      );

      const updatedEvent: Event = response.data.data;

      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id ? updatedEvent : item
        )
      );
    } catch (err: unknown) {
      console.error(
        "Toggle event status error:",
        err
      );

      if (axios.isAxiosError(err)) {
        alert(
          err.response?.data?.message ||
            "Failed to update event status."
        );
      } else {
        alert("Failed to update event status.");
      }
    }
  };

  /*
   * Format date
   */
  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  /*
   * Format time
   */
  const formatTime = (time: string | null) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <span className="loading loading-spinner loading-md text-[#911824]" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#5B403D]">
              Events
            </h2>

            <p className="text-sm text-gray-500">
              Manage hospital events.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {events.length}{" "}
            {events.length === 1 ? "event" : "events"}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <FiCalendar
              size={36}
              className="mx-auto mb-3 text-gray-400"
            />

            <h3 className="font-medium text-[#5B403D]">
              No events found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add an event to see it here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Event
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Location
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Event */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {event.cover_image_url ? (
                                <img
                                  src={
                                    event.cover_image_url
                                  }
                                  alt={event.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                  <FiCalendar
                                    size={20}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="max-w-60 truncate text-sm font-semibold text-[#5B403D]">
                                  {event.title}
                                </p>

                                {event.is_featured && (
                                  <FiStar
                                    size={14}
                                    className="shrink-0 fill-current text-[#911824]"
                                  />
                                )}
                              </div>

                              <p className="text-xs text-gray-500">
                                Event #{event.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar size={15} />

                            {formatDate(
                              event.event_date
                            )}
                          </div>

                          {(event.start_time ||
                            event.end_time) && (
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                              <FiClock size={13} />

                              {formatTime(
                                event.start_time
                              )}

                              {event.end_time &&
                                ` - ${formatTime(
                                  event.end_time
                                )}`}
                            </div>
                          )}
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4">
                          <div className="flex max-w-48 items-center gap-2 text-sm text-gray-600">
                            <FiMapPin
                              size={15}
                              className="shrink-0"
                            />

                            <span className="truncate">
                              {event.location ||
                                "No location"}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleActive(
                                event
                              )
                            }
                            className={`badge border-0 px-3 py-3 text-xs ${
                              event.is_active
                                ? "badge-success text-white"
                                : "badge-ghost"
                            }`}
                          >
                            {event.is_active
                              ? "Active"
                              : "Inactive"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {/* View */}
                            <button
                              type="button"
                              onClick={() =>
                                handleView(event)
                              }
                              title="View event"
                              className="btn btn-ghost btn-sm text-gray-500 hover:bg-gray-100 hover:text-[#911824]"
                            >
                              <FiEye size={17} />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() =>
                                onEdit?.(event)
                              }
                              title="Edit event"
                              className="btn btn-ghost btn-sm text-gray-500 hover:bg-gray-100 hover:text-[#911824]"
                            >
                              <FiEdit2 size={17} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(event.id)
                              }
                              title="Delete event"
                              className="btn btn-ghost btn-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <FiTrash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Image */}
                  <div className="h-48 w-full bg-gray-100">
                    {event.cover_image_url ? (
                      <img
                        src={event.cover_image_url}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <FiCalendar size={32} />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#5B403D]">
                            {event.title}
                          </h3>

                          {event.is_featured && (
                            <FiStar
                              size={14}
                              className="fill-current text-[#911824]"
                            />
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Event #{event.id}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleActive(event)
                        }
                        className={`badge border-0 ${
                          event.is_active
                            ? "badge-success text-white"
                            : "badge-ghost"
                        }`}
                      >
                        {event.is_active
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar size={15} />

                        {formatDate(
                          event.event_date
                        )}
                      </div>

                      {(event.start_time ||
                        event.end_time) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiClock size={15} />

                          {formatTime(
                            event.start_time
                          )}

                          {event.end_time &&
                            ` - ${formatTime(
                              event.end_time
                            )}`}
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMapPin size={15} />

                          <span className="truncate">
                            {event.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mobile Actions */}
                    <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleView(event)
                        }
                        className="btn btn-sm btn-ghost"
                      >
                        <FiEye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(event)
                        }
                        className="btn btn-sm btn-ghost"
                      >
                        <FiEdit2 size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(event.id)
                        }
                        className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* =========================
          VIEW EVENT DAISYUI MODAL
          ========================= */}
      <dialog
        ref={viewModalRef}
        className="modal"
        onClose={() => setSelectedEvent(null)}
      >
        <div className="modal-box w-11/12 max-w-3xl p-0">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-[#5B403D]">
                Event Details
              </h3>

              <p className="text-xs text-gray-500">
                View complete event information
              </p>
            </div>

            <button
              type="button"
              onClick={closeViewModal}
              className="btn btn-circle btn-sm btn-ghost"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Modal Body */}
          {selectedEvent && (
            <div>
              {/* Cover Image */}
              <div className="h-64 w-full bg-gray-100 sm:h-72">
                {selectedEvent.cover_image_url ? (
                  <img
                    src={
                      selectedEvent.cover_image_url
                    }
                    alt={selectedEvent.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <div className="text-center">
                      <FiCalendar
                        size={40}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        No cover image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                {/* Title */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-[#5B403D]">
                        {selectedEvent.title}
                      </h2>

                      {selectedEvent.is_featured && (
                        <span className="badge badge-outline border-[#911824] text-[#911824]">
                          <FiStar size={13} />
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      Event #{selectedEvent.id}
                    </p>
                  </div>

                  <span
                    className={`badge border-0 ${
                      selectedEvent.is_active
                        ? "badge-success text-white"
                        : "badge-ghost"
                    }`}
                  >
                    {selectedEvent.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* Information Grid */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Date */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      <FiCalendar size={14} />
                      Date
                    </div>

                    <p className="mt-2 text-sm font-medium text-[#5B403D]">
                      {formatDate(
                        selectedEvent.event_date
                      )}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      <FiClock size={14} />
                      Time
                    </div>

                    <p className="mt-2 text-sm font-medium text-[#5B403D]">
                      {selectedEvent.start_time
                        ? formatTime(
                            selectedEvent.start_time
                          )
                        : "Not specified"}

                      {selectedEvent.end_time &&
                        ` - ${formatTime(
                          selectedEvent.end_time
                        )}`}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      <FiMapPin size={14} />
                      Location
                    </div>

                    <p className="mt-2 text-sm font-medium text-[#5B403D]">
                      {selectedEvent.location ||
                        "No location specified"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-[#5B403D]">
                    Description
                  </h4>

                  <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4">
                    {selectedEvent.description ? (
                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {selectedEvent.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-gray-400">
                        No description available.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex flex-col gap-1 text-xs text-gray-400 sm:flex-row sm:justify-between">
                    <span>
                      Created:{" "}
                      {new Date(
                        selectedEvent.created_at
                      ).toLocaleString()}
                    </span>

                    <span>
                      Updated:{" "}
                      {new Date(
                        selectedEvent.updated_at
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex justify-end border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={closeViewModal}
              className="btn bg-[#911824] text-white hover:bg-[#86000D]"
            >
              Close
            </button>
          </div>
        </div>

        {/* Click outside modal to close */}
        <form
          method="dialog"
          className="modal-backdrop"
        >
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default EventsList;

