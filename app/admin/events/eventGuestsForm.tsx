"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FiArrowLeft,
  FiImage,
  FiSave,
  FiUpload,
  FiX,
} from "react-icons/fi";

import { EventGuest } from "./eventGuests";

// ============================================================
// TYPES
// ============================================================

interface Event {
  id: number;
  title: string;
}

interface EventsResponse {
  success: boolean;
  data: Event[];
  message?: string;
}

interface EventGuestFormProps {
  guest?: EventGuest | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormState {
  event_id: string;
  name: string;
  designation: string;
  organization: string;
  description: string;
}

// ============================================================
// DEFAULT FORM
// ============================================================

const emptyForm: FormState = {
  event_id: "",
  name: "",
  designation: "",
  organization: "",
  description: "",
};

// ============================================================
// COMPONENT
// ============================================================

function EventGuestForm({
  guest,
  onSuccess,
  onCancel,
}: EventGuestFormProps) {
  // ----------------------------------------------------------
  // STATES
  // ----------------------------------------------------------

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [events, setEvents] =
    useState<Event[]>([]);

  const [loadingEvents, setLoadingEvents] =
    useState(true);

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ----------------------------------------------------------
  // EDIT MODE
  // ----------------------------------------------------------

  const isEditMode = Boolean(guest);

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
          setEvents(response.data.data);
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
  // POPULATE FORM WHEN EDITING
  // ----------------------------------------------------------

  useEffect(() => {
    /*
     * Edit mode:
     * Populate the form with the selected guest.
     */
    if (guest) {
      setForm({
        event_id: String(guest.event_id),
        name: guest.name || "",
        designation: guest.designation || "",
        organization: guest.organization || "",
        description: guest.description || "",
      });

      // Show existing Cloudinary photo
      setImagePreview(
        guest.photo_url || null
      );

      // No replacement photo initially
      setImage(null);

      setError("");
      setSuccess("");
    }

    /*
     * Add mode:
     * Completely reset the form.
     */
    else {
      setForm({ ...emptyForm });

      setImage(null);
      setImagePreview(null);

      setError("");
      setSuccess("");
    }
  }, [guest]);

  // ----------------------------------------------------------
  // INPUT CHANGE
  // ----------------------------------------------------------

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------------------------------
  // IMAGE CHANGE
  // ----------------------------------------------------------

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5MB."
      );

      e.target.value = "";

      return;
    }

    setError("");

    // Remove previous blob URL
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ----------------------------------------------------------
  // REMOVE / RESTORE IMAGE
  // ----------------------------------------------------------

  const handleRemoveImage = () => {
    /*
     * Remove blob preview if a new photo was selected.
     */
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);

    /*
     * During edit mode restore the original photo.
     *
     * We don't actually delete the existing Cloudinary
     * image from the database.
     */
    if (guest?.photo_url) {
      setImagePreview(guest.photo_url);
    } else {
      setImagePreview(null);
    }
  };

  // ----------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!form.event_id) {
      setError("Please select an event.");
      return;
    }

    if (!form.name.trim()) {
      setError("Guest name is required.");
      return;
    }

    try {
      setSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "event_id",
        form.event_id
      );

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "designation",
        form.designation.trim()
      );

      formData.append(
        "organization",
        form.organization.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      /*
       * Photo is optional.
       *
       * In edit mode:
       * - no new photo = keep existing photo
       * - new photo = replace existing photo
       */
      if (image) {
        formData.append(
          "photo",
          image
        );
      }

      let response;

      // ======================================================
      // CREATE
      // ======================================================

      if (!isEditMode) {
        response = await axios.post(
          "/api/events/guests",
          formData
        );
      }

      // ======================================================
      // UPDATE
      // ======================================================

      else {
        formData.append(
          "id",
          String(guest!.id)
        );

        response = await axios.put(
          "/api/events/guests",
          formData
        );
      }

      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      if (response.data.success) {
        setSuccess(
          isEditMode
            ? "Guest updated successfully."
            : "Guest added successfully."
        );

        /*
         * Return to Guests tab after displaying the
         * success message briefly.
         */
        setTimeout(() => {
          onSuccess?.();
        }, 700);
      } else {
        setError(
          response.data.message ||
            "Something went wrong."
        );
      }
    } catch (err: any) {
      console.error(
        "Error saving event guest:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to save guest. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------------
  // CLEANUP BLOB URL
  // ----------------------------------------------------------

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full">

      {/* ====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#5B403D]">
            {isEditMode
              ? "Edit Event Guest"
              : "Add Event Guest"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Update the selected event guest."
              : "Add a guest or special attendee to an event."}
          </p>
        </div>

        {/* Back */}

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-gray-200
            px-4
            py-2
            text-sm
            font-medium
            text-gray-600
            transition
            hover:border-[#911824]
            hover:text-[#911824]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <FiArrowLeft size={16} />

          Back to Guests
        </button>
      </div>

      {/* ====================================================
          MESSAGES
      ===================================================== */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white shadow-sm"
      >

        <div className="p-5 sm:p-6">

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div className="space-y-5">

              {/* Event */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                  Event
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="event_id"
                  value={form.event_id}
                  onChange={handleChange}
                  disabled={
                    loadingEvents ||
                    submitting
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
                  <option value="">
                    {loadingEvents
                      ? "Loading events..."
                      : "Select an event"}
                  </option>

                  {events.map((event) => (
                    <option
                      key={event.id}
                      value={event.id}
                    >
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                  Guest Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Guest full name"
                  className="
                    input
                    input-bordered
                    w-full
                    border-gray-300
                    bg-white
                    focus:border-[#911824]
                    focus:outline-none
                  "
                />
              </div>

              {/* Designation */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="e.g. Chief Guest, CEO, Director"
                  className="
                    input
                    input-bordered
                    w-full
                    border-gray-300
                    bg-white
                    focus:border-[#911824]
                    focus:outline-none
                  "
                />
              </div>

              {/* Organization */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                  Organization
                </label>

                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Organization or institution"
                  className="
                    input
                    input-bordered
                    w-full
                    border-gray-300
                    bg-white
                    focus:border-[#911824]
                    focus:outline-none
                  "
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={submitting}
                  rows={6}
                  placeholder="Short description about the guest..."
                  className="
                    textarea
                    textarea-bordered
                    w-full
                    resize-none
                    border-gray-300
                    bg-white
                    focus:border-[#911824]
                    focus:outline-none
                  "
                />
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE - PHOTO
            ================================================== */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                Guest Photo
              </label>

              {/* Preview */}

              <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">

                {imagePreview ? (
                  <div className="relative aspect-[4/3]">

                    <img
                      src={imagePreview}
                      alt={
                        form.name ||
                        "Guest photo"
                      }
                      className="h-full w-full object-cover"
                    />

                    {/* Remove / Restore */}

                    <button
                      type="button"
                      onClick={
                        handleRemoveImage
                      }
                      disabled={submitting}
                      className="
                        absolute
                        right-3
                        top-3
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-red-600
                        shadow-md
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      title={
                        isEditMode &&
                        !image
                          ? "Restore existing photo"
                          : "Remove photo"
                      }
                    >
                      <FiX size={17} />
                    </button>

                    {/* Replace */}

                    <label
                      className="
                        absolute
                        bottom-3
                        left-1/2
                        flex
                        -translate-x-1/2
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-lg
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-[#5B403D]
                        shadow-md
                        transition
                        hover:text-[#911824]
                      "
                    >
                      <FiUpload size={15} />

                      Replace Photo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleImageChange
                        }
                        disabled={submitting}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center p-6 text-center">

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(145,24,36,.08)]">
                      <FiImage className="text-2xl text-[#911824]" />
                    </div>

                    <p className="text-sm font-medium text-[#5B403D]">
                      Click to upload guest photo
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, JPEG or WEBP
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Maximum 5MB
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      disabled={submitting}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {isEditMode && (
                <p className="mt-2 text-xs text-gray-400">
                  Leave the photo unchanged to keep the
                  existing guest photo.
                </p>
              )}

              {!isEditMode && (
                <p className="mt-2 text-xs text-gray-400">
                  Guest photo is optional.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

          {/* Cancel */}

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-gray-300
              bg-white
              px-5
              py-2.5
              text-sm
              font-medium
              text-gray-600
              transition
              hover:border-gray-400
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FiArrowLeft size={16} />

            Cancel
          </button>

          {/* Submit */}

          <button
            type="submit"
            disabled={submitting}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#911824]
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#86000D]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />

                {isEditMode
                  ? "Updating..."
                  : "Adding..."}
              </>
            ) : (
              <>
                <FiSave size={16} />

                {isEditMode
                  ? "Update Guest"
                  : "Add Guest"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventGuestForm;

