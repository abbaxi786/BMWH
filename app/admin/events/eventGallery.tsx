"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FiEdit2,
  FiEye,
  FiImage,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

// ============================================================
// TYPES
// ============================================================

export interface EventGalleryItem {
  id: number;
  event_id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
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

interface GalleryResponse {
  success: boolean;
  data: EventGalleryItem[];
  message?: string;
}

interface EventGalleryProps {
  onEdit?: (gallery: EventGalleryItem) => void;
}

// ============================================================
// COMPONENT
// ============================================================

function EventGallery({ onEdit }: EventGalleryProps) {
  // ----------------------------------------------------------
  // STATES
  // ----------------------------------------------------------

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const [gallery, setGallery] = useState<EventGalleryItem[]>([]);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Selected image for view modal
  const [selectedImage, setSelectedImage] =
    useState<EventGalleryItem | null>(null);

  // ----------------------------------------------------------
  // FETCH EVENTS
  // ----------------------------------------------------------

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setError("");

        const response = await axios.get<EventsResponse>(
          "/api/events/all"
        );

        if (response.data.success) {
          setEvents(response.data.data);

          // Automatically select first event
          if (response.data.data.length > 0) {
            setSelectedEventId(String(response.data.data[0].id));
          }
        } else {
          setError(response.data.message || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);

        setError(
          "Failed to load events. Please refresh the page and try again."
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // ----------------------------------------------------------
  // FETCH GALLERY WHEN EVENT CHANGES
  // ----------------------------------------------------------

  useEffect(() => {
    if (!selectedEventId) {
      setGallery([]);
      return;
    }

    fetchGallery(selectedEventId);
  }, [selectedEventId]);

  // ----------------------------------------------------------
  // FETCH GALLERY
  // ----------------------------------------------------------

  const fetchGallery = async (eventId: string) => {
    try {
      setLoadingGallery(true);
      setError("");

      const response = await axios.get<GalleryResponse>(
        `/api/events/event_gallery?event_id=${eventId}`
      );

      if (response.data.success) {
        setGallery(response.data.data);
      } else {
        setGallery([]);
        setError(
          response.data.message || "Failed to fetch gallery"
        );
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);

      setGallery([]);

      setError(
        "Failed to load gallery images. Please try again."
      );
    } finally {
      setLoadingGallery(false);
    }
  };

  // ----------------------------------------------------------
  // DELETE GALLERY IMAGE
  // ----------------------------------------------------------

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);

      const response = await axios.delete(
        "/api/events/event_gallery",
        {
          data: {
            id,
          },
        }
      );

      if (response.data.success) {
        // Remove deleted image immediately from UI
        setGallery((previousGallery) =>
          previousGallery.filter((item) => item.id !== id)
        );
      } else {
        alert(
          response.data.message ||
            "Failed to delete gallery image."
        );
      }
    } catch (err) {
      console.error("Error deleting gallery image:", err);

      alert(
        "Failed to delete gallery image. Please try again."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ----------------------------------------------------------
  // VIEW IMAGE
  // ----------------------------------------------------------

  const handleView = (item: EventGalleryItem) => {
    setSelectedImage(item);

    const modal = document.getElementById(
      "event-gallery-view-modal"
    ) as HTMLDialogElement | null;

    modal?.showModal();
  };

  // ----------------------------------------------------------
  // CLOSE VIEW MODAL
  // ----------------------------------------------------------

  const closeViewModal = () => {
    const modal = document.getElementById(
      "event-gallery-view-modal"
    ) as HTMLDialogElement | null;

    modal?.close();

    setSelectedImage(null);
  };

  // ----------------------------------------------------------
  // SELECTED EVENT
  // ----------------------------------------------------------

  const selectedEvent = events.find(
    (event) => String(event.id) === selectedEventId
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#5B403D]">
            Event Gallery
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage images uploaded for hospital events.
          </p>
        </div>

        {/* Event Selector */}
        <div className="w-full sm:w-72">
          <label className="mb-1 block text-sm font-medium text-[#5B403D]">
            Select Event
          </label>

          <select
            value={selectedEventId}
            onChange={(e) =>
              setSelectedEventId(e.target.value)
            }
            disabled={loadingEvents}
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
            <option value="">
              {loadingEvents
                ? "Loading events..."
                : "Select an event"}
            </option>

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          SELECTED EVENT INFO
      ====================================================== */}

      {selectedEvent && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(145,24,36,.1)]">
            <FiImage className="text-lg text-[#911824]" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Gallery for
            </p>

            <p className="font-medium text-[#5B403D]">
              {selectedEvent.title}
            </p>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            {gallery.length}{" "}
            {gallery.length === 1 ? "image" : "images"}
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loadingGallery && (
        <div className="flex min-h-60 items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#911824]" />
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!loadingGallery &&
        selectedEventId &&
        gallery.length === 0 && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(145,24,36,.08)]">
              <FiImage className="text-2xl text-[#911824]" />
            </div>

            <h3 className="text-lg font-semibold text-[#5B403D]">
              No gallery images
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              There are no gallery images uploaded for this
              event yet.
            </p>
          </div>
        )}

      {/* =====================================================
          GALLERY GRID
      ====================================================== */}

      {!loadingGallery && gallery.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition
                duration-200
                hover:shadow-md
              "
            >
              {/* Image */}
              <div className="group relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={item.image_url}
                  alt={item.title || "Event gallery image"}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-300
                    group-hover:scale-105
                  "
                />

                {/* View overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleView(item)}
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#911824]
                      shadow
                      transition
                      hover:bg-[#911824]
                      hover:text-white
                    "
                    title="View image"
                  >
                    <FiEye size={18} />
                  </button>
                </div>

                {/* Status */}
                <div className="absolute left-3 top-3">
                  {item.is_active ? (
                    <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-green-700 shadow">
                      <FiCheckCircle size={12} />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow">
                      <FiClock size={12} />
                      Inactive
                    </span>
                  )}
                </div>

                {/* Display Order */}
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                    #{item.display_order}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3 min-h-14">
                  <h3 className="line-clamp-1 font-semibold text-[#5B403D]">
                    {item.title || "Untitled image"}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {item.description ||
                      "No description available."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                  {/* View */}
                  <button
                    type="button"
                    onClick={() => handleView(item)}
                    className="
                      flex
                      h-9
                      flex-1
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      border
                      border-gray-200
                      text-sm
                      text-gray-600
                      transition
                      hover:border-[#911824]
                      hover:text-[#911824]
                    "
                    title="View"
                  >
                    <FiEye size={15} />
                    View
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => onEdit?.(item)}
                    className="
                      flex
                      h-9
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-gray-200
                      text-gray-600
                      transition
                      hover:border-[#911824]
                      hover:bg-[rgba(145,24,36,.05)]
                      hover:text-[#911824]
                    "
                    title="Edit"
                  >
                    <FiEdit2 size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteLoading === item.id}
                    className="
                      flex
                      h-9
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-red-200
                      text-red-600
                      transition
                      hover:bg-red-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                    title="Delete"
                  >
                    {deleteLoading === item.id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <FiTrash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          VIEW IMAGE MODAL
      ====================================================== */}

      <dialog
        id="event-gallery-view-modal"
        className="modal"
      >
        <div className="modal-box max-w-4xl p-0">
          {selectedImage && (
            <>
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-[#5B403D]">
                    {selectedImage.title ||
                      "Event Gallery Image"}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Gallery ID: {selectedImage.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeViewModal}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    hover:text-[#911824]
                  "
                >
                  <FiX size={19} />
                </button>
              </div>

              {/* Image */}
              <div className="bg-gray-100">
                <img
                  src={selectedImage.image_url}
                  alt={
                    selectedImage.title ||
                    "Event gallery image"
                  }
                  className="max-h-[65vh] w-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="space-y-3 p-5">
                {selectedImage.description && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Description
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {selectedImage.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Event ID
                    </p>

                    <p className="text-sm font-medium text-[#5B403D]">
                      {selectedImage.event_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Display Order
                    </p>

                    <p className="text-sm font-medium text-[#5B403D]">
                      {selectedImage.display_order}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Status
                    </p>

                    <p
                      className={`text-sm font-medium ${
                        selectedImage.is_active
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {selectedImage.is_active
                        ? "Active"
                        : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Close when clicking outside */}
        <form
          method="dialog"
          className="modal-backdrop"
        >
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default EventGallery;
