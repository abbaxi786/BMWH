"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FiCalendar,
  FiClock,
  FiImage,
  FiMapPin,
  FiSave,
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

interface EventFormProps {
  event?: Event | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormDataState {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  is_featured: boolean;
  is_active: boolean;
}

const emptyForm: FormDataState = {
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  location: "",
  is_featured: false,
  is_active: true,
};

function EventForm({
  event = null,
  onSuccess,
  onCancel,
}: EventFormProps) {
  const isEditMode = Boolean(event);

  const [formData, setFormData] =
    useState<FormDataState>(emptyForm);

  const [coverImage, setCoverImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * ==========================================
   * LOAD EVENT INTO FORM
   * ==========================================
   */
  useEffect(() => {
    setError("");
    setSuccess("");
    setCoverImage(null);

    /*
     * ========================================
     * EDIT MODE
     * ========================================
     */
    if (event) {
      setFormData({
        title: event.title || "",

        description:
          event.description || "",

        event_date: event.event_date
          ? event.event_date.split("T")[0]
          : "",

        start_time:
          event.start_time || "",

        end_time:
          event.end_time || "",

        location:
          event.location || "",

        is_featured:
          Boolean(event.is_featured),

        is_active:
          Boolean(event.is_active),
      });

      /*
       * Existing Cloudinary image
       */
      setImagePreview(
        event.cover_image_url || null
      );

      return;
    }

    /*
     * ========================================
     * ADD MODE
     * ========================================
     */
    setFormData({
      ...emptyForm,
    });

    setImagePreview(null);
  }, [event]);

  /*
   * ==========================================
   * NORMAL INPUT CHANGE
   * ==========================================
   */
  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * ==========================================
   * CHECKBOX CHANGE
   * ==========================================
   */
  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  /*
   * ==========================================
   * IMAGE CHANGE
   * ==========================================
   */
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    /*
     * Validate image type
     */
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      e.target.value = "";
      return;
    }

    /*
     * Maximum 5MB
     */
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    setError("");

    /*
     * Remove previous blob URL
     */
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setCoverImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /*
   * ==========================================
   * REMOVE NEW IMAGE
   * ==========================================
   */
  const handleRemoveImage = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    /*
     * Remove replacement image
     */
    setCoverImage(null);

    /*
     * Restore existing image in edit mode
     */
    if (event?.cover_image_url) {
      setImagePreview(
        event.cover_image_url
      );
    } else {
      setImagePreview(null);
    }
  };

  /*
   * ==========================================
   * SUBMIT FORM
   * ==========================================
   */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /*
     * ========================================
     * VALIDATION
     * ========================================
     */

    if (!formData.title.trim()) {
      setError(
        "Event title is required."
      );
      return;
    }

    if (!formData.event_date) {
      setError(
        "Event date is required."
      );
      return;
    }

    /*
     * ========================================
     * CREATE FORMDATA
     * ========================================
     */
    try {
      setLoading(true);

      const data = new FormData();

      /*
       * Event title
       */
      data.append(
        "title",
        formData.title.trim()
      );

      /*
       * Description
       */
      data.append(
        "description",
        formData.description.trim()
      );

      /*
       * Event date
       */
      data.append(
        "event_date",
        formData.event_date
      );

      /*
       * Start time
       */
      data.append(
        "start_time",
        formData.start_time
      );

      /*
       * End time
       */
      data.append(
        "end_time",
        formData.end_time
      );

      /*
       * Location
       */
      data.append(
        "location",
        formData.location.trim()
      );

      /*
       * Featured
       *
       * Your API converts these strings
       * into boolean values.
       */
      data.append(
        "is_featured",
        formData.is_featured
          ? "true"
          : "false"
      );

      /*
       * Active
       *
       * Only needed by PUT.
       * Your POST route doesn't read it.
       */
      if (isEditMode) {
        data.append(
          "is_active",
          formData.is_active
            ? "true"
            : "false"
        );
      }

      /*
       * ========================================
       * EDIT EVENT
       * ========================================
       *
       * IMPORTANT:
       *
       * Your API expects:
       *
       * formData.get("id")
       *
       * NOT:
       *
       * formData.get("event_id")
       */
      if (isEditMode && event) {
        data.append(
          "id",
          String(event.id)
        );

        console.log(
          "Updating event ID:",
          event.id
        );
      }

      /*
       * ========================================
       * COVER IMAGE
       * ========================================
       *
       * Only send an image if the admin
       * selected a new one.
       *
       * During edit, the API will keep the
       * existing image when this is missing.
       */
      if (coverImage) {
        data.append(
          "cover_image",
          coverImage
        );
      }

      /*
       * ========================================
       * CREATE
       * ========================================
       */
      if (!isEditMode) {
        await axios.post(
          "/api/events",
          data
        );

        setSuccess(
          "Event created successfully."
        );
      }

      /*
       * ========================================
       * UPDATE
       * ========================================
       */
      if (isEditMode) {
        await axios.put(
          "/api/events",
          data
        );

        setSuccess(
          "Event updated successfully."
        );
      }

      /*
       * Return to event list
       */
      setTimeout(() => {
        onSuccess?.();
      }, 700);

    } catch (err: unknown) {
      console.error(
        "Event form error:",
        err
      );

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while saving the event."
        );
      } else {
        setError(
          "Something went wrong while saving the event."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================
   * CLEANUP BLOB URL
   * ==========================================
   */
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

  return (
    <div className="w-full">

      {/* ======================================
          HEADER
          ====================================== */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">

          <div>
            <h2 className="text-xl font-semibold text-[#5B403D]">
              {isEditMode
                ? "Edit Event"
                : "Add Event"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update the event information below."
                : "Create a new hospital event."}
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiX size={16} />

              Cancel
            </button>
          )}

        </div>
      </div>

      {/* ======================================
          ERROR
          ====================================== */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ======================================
          SUCCESS
          ====================================== */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ======================================
          FORM
          ====================================== */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* TITLE */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#5B403D]">
              Event Title

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#911824] focus:ring-1 focus:ring-[#911824] disabled:bg-gray-100"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#5B403D]">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter event description"
              disabled={loading}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#911824] focus:ring-1 focus:ring-[#911824] disabled:bg-gray-100"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5B403D]">
              <FiCalendar size={16} />

              Event Date

              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#911824] focus:ring-1 focus:ring-[#911824] disabled:bg-gray-100"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5B403D]">
              <FiMapPin size={16} />

              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Hospital Auditorium"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#911824] focus:ring-1 focus:ring-[#911824] disabled:bg-gray-100"
            />
          </div>

          {/* START TIME */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5B403D]">
              <FiClock size={16} />

              Start Time
            </label>

            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#911824] focus:ring-1 focus:ring-[#911824] disabled:bg-gray-100"
            />
          </div>

          {/* END TIME */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5B403D]">
              <FiClock size={16} />

              End Time
            </label>

            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#911824] focus:ring-1 focus:ring-[#911824] disabled:bg-gray-100"
            />
          </div>

          {/* COVER IMAGE */}
          <div className="lg:col-span-2">

            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5B403D]">
              <FiImage size={16} />

              Cover Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm file:mr-4 file:border-0 file:bg-[#911824] file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-[#86000D] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-gray-400">
              Maximum image size: 5MB.

              {isEditMode &&
                " Leave empty to keep the current image."}
            </p>

            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="mt-4">

                <p className="mb-2 text-xs font-medium text-gray-500">
                  {coverImage
                    ? "New Image Preview"
                    : "Current Cover Image"}
                </p>

                <div className="relative h-56 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 md:w-96">

                  <img
                    src={imagePreview}
                    alt="Event cover preview"
                    className="h-full w-full object-cover"
                  />

                  {coverImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow-md transition hover:bg-red-50 disabled:opacity-50"
                      title="Remove new image"
                    >
                      <FiX size={16} />
                    </button>
                  )}

                </div>

                {isEditMode &&
                  !coverImage && (
                    <p className="mt-2 text-xs text-gray-400">
                      Select a new image above if you
                      want to replace this image.
                    </p>
                  )}

              </div>
            )}

          </div>

          {/* OPTIONS */}
          <div className="lg:col-span-2">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* FEATURED */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">

                <input
                  type="checkbox"
                  name="is_featured"
                  checked={
                    formData.is_featured
                  }
                  onChange={
                    handleCheckboxChange
                  }
                  disabled={loading}
                  className="h-4 w-4 accent-[#911824]"
                />

                <div>
                  <p className="text-sm font-medium text-[#5B403D]">
                    Featured Event
                  </p>

                  <p className="text-xs text-gray-500">
                    Show this event in featured
                    sections.
                  </p>
                </div>

              </label>

              {/* ACTIVE */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    formData.is_active
                  }
                  onChange={
                    handleCheckboxChange
                  }
                  disabled={loading}
                  className="h-4 w-4 accent-[#911824]"
                />

                <div>
                  <p className="text-sm font-medium text-[#5B403D]">
                    Active Event
                  </p>

                  <p className="text-xs text-gray-500">
                    Make this event visible on
                    the website.
                  </p>
                </div>

              </label>

            </div>

          </div>

        </div>

        {/* ======================================
            BUTTONS
            ====================================== */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#911824] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#86000D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSave size={17} />

            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Event"
              : "Create Event"}
          </button>

        </div>
      </form>
    </div>
  );
}

export default EventForm;
