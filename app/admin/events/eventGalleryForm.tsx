"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import axios from "axios";

import {
  FiImage,
  FiUpload,
  FiX,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";

import { EventGalleryItem } from "./eventGallery";

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

interface EventGalleryFormProps {
  gallery?: EventGalleryItem | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormState {
  event_id: string;
  title: string;
  description: string;
  display_order: string;
  is_active: boolean;
}

// ============================================================
// DEFAULT FORM
// ============================================================

const emptyForm: FormState = {
  event_id: "",
  title: "",
  description: "",
  display_order: "0",
  is_active: true,
};

// ============================================================
// COMPONENT
// ============================================================

function EventGalleryForm({
  gallery,
  onSuccess,
  onCancel,
}: EventGalleryFormProps) {
  // ----------------------------------------------------------
  // STATES
  // ----------------------------------------------------------

  const [form, setForm] = useState<FormState>(emptyForm);

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------------------------------
  // EDIT MODE
  // ----------------------------------------------------------

  const isEditMode = Boolean(gallery);

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
        } else {
          setError(
            response.data.message || "Failed to load events."
          );
        }
      } catch (err) {
        console.error("Error fetching events:", err);

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
  // POPULATE FORM
  // ----------------------------------------------------------

  useEffect(() => {
    /*
     * Important:
     * Whenever `gallery` changes, completely replace the
     * current form state with the selected gallery data.
     *
     * This prevents old edit data from remaining when the
     * admin clicks Edit on another gallery image.
     */

    if (gallery) {
      setForm({
        event_id: String(gallery.event_id),
        title: gallery.title ?? "",
        description: gallery.description ?? "",
        display_order: String(gallery.display_order ?? 0),
        is_active: gallery.is_active,
      });

      // Show existing Cloudinary image
      setImagePreview(gallery.image_url);

      // No replacement image selected initially
      setImage(null);

      setError("");
      setSuccess("");
    } else {
      // Reset everything for Add mode
      setForm({ ...emptyForm });

      setImage(null);
      setImagePreview(null);

      setError("");
      setSuccess("");
    }
  }, [gallery]);

  // ----------------------------------------------------------
  // FORM INPUT
  // ----------------------------------------------------------

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------------------------------
  // ACTIVE CHECKBOX
  // ----------------------------------------------------------

  const handleActiveChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm((previous) => ({
      ...previous,
      is_active: e.target.checked,
    }));
  };

  // ----------------------------------------------------------
  // IMAGE SELECT / REPLACE
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
      setError("Please select a valid image file.");

      // Reset file input
      e.target.value = "";

      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");

      // Reset file input
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

    // Store new file
    setImage(file);

    // Create new preview
    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ----------------------------------------------------------
  // REMOVE / RESTORE IMAGE
  // ----------------------------------------------------------

  const handleRemoveImage = () => {
    /*
     * If the current preview is a blob URL, it means the admin
     * selected a replacement image.
     */
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);

    /*
     * EDIT MODE
     *
     * Restore the original Cloudinary image instead of
     * leaving the preview empty.
     *
     * The existing image will remain in the database because
     * we simply don't send a new image in the PUT request.
     */
    if (gallery?.image_url) {
      setImagePreview(gallery.image_url);
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

    /*
     * Image is required only when creating a new gallery item.
     *
     * During edit mode the existing Cloudinary image can be
     * kept without selecting another image.
     */
    if (!isEditMode && !image) {
      setError("Please select a gallery image.");
      return;
    }

    const displayOrder = Number(form.display_order);

    if (
      form.display_order.trim() === "" ||
      Number.isNaN(displayOrder)
    ) {
      setError("Display order must be a valid number.");
      return;
    }

    if (displayOrder < 0) {
      setError("Display order cannot be negative.");
      return;
    }

    // --------------------------------------------------------
    // SUBMIT
    // --------------------------------------------------------

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("event_id", form.event_id);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append(
        "display_order",
        String(displayOrder)
      );
      formData.append(
        "is_active",
        String(form.is_active)
      );

      /*
       * IMPORTANT:
       *
       * In edit mode, image is optional.
       *
       * If no new image was selected, don't append "image".
       * Your API will then keep the existing Cloudinary image.
       */
      if (image) {
        formData.append("image", image);
      }

      let response;

      // ======================================================
      // CREATE
      // ======================================================

      if (!isEditMode) {
        response = await axios.post(
          "/api/events/event_gallery",
          formData
        );
      }

      // ======================================================
      // UPDATE
      // ======================================================

      else {
        /*
         * The API needs the gallery record ID to know which
         * gallery image should be updated.
         */
        formData.append(
          "id",
          String(gallery!.id)
        );

        response = await axios.put(
          "/api/events/event_gallery",
          formData
        );
      }

      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      if (response.data.success) {
        setSuccess(
          isEditMode
            ? "Gallery image updated successfully."
            : "Gallery image added successfully."
        );

        /*
         * Return to Gallery tab after a short delay so the
         * success message can be seen.
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
        "Error saving gallery image:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to save gallery image. Please try again."
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
              ? "Edit Gallery Image"
              : "Add Gallery Image"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Update the selected event gallery image."
              : "Add a new image to an event gallery."}
          </p>
        </div>

        {/* Back Button */}

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

          Back to Gallery
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
                  disabled={loadingEvents || submitting}
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

              {/* Title */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Gallery image title"
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
                  rows={5}
                  placeholder="Describe this gallery image..."
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

              {/* Display Order */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                  Display Order
                </label>

                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={handleChange}
                  disabled={submitting}
                  min="0"
                  placeholder="0"
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

                <p className="mt-1 text-xs text-gray-400">
                  Lower numbers appear first.
                </p>
              </div>

              {/* Active */}

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">

                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleActiveChange}
                  disabled={submitting}
                  className="
                    checkbox
                    border-gray-300
                    checked:border-[#911824]
                    checked:bg-[#911824]
                  "
                />

                <div>
                  <p className="text-sm font-medium text-[#5B403D]">
                    Active
                  </p>

                  <p className="text-xs text-gray-500">
                    Show this image in the public gallery.
                  </p>
                </div>
              </label>
            </div>

            {/* =================================================
                RIGHT SIDE - IMAGE
            ================================================== */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-[#5B403D]">
                Gallery Image

                {!isEditMode && (
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                )}
              </label>

              {/* Image Preview */}

              <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">

                {imagePreview ? (
                  <div className="relative aspect-[4/3]">

                    <img
                      src={imagePreview}
                      alt={
                        form.title ||
                        "Gallery preview"
                      }
                      className="h-full w-full object-cover"
                    />

                    {/* Remove / Restore */}

                    <button
                      type="button"
                      onClick={handleRemoveImage}
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
                        isEditMode && !image
                          ? "Restore existing image"
                          : "Remove image"
                      }
                    >
                      <FiX size={17} />
                    </button>

                    {/* Replace Image */}

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

                      Replace Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
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
                      Click to upload an image
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
                      onChange={handleImageChange}
                      disabled={submitting}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Edit mode information */}

              {isEditMode && (
                <p className="mt-2 text-xs text-gray-400">
                  Leave the image unchanged to keep the
                  existing gallery image.
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
                  ? "Update Gallery"
                  : "Add Gallery"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventGalleryForm;
