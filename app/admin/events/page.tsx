"use client";

import React, { useState } from "react";

import EventForm, { Event } from "./eventForm";
import EventGuestForm from "./eventGuestsForm";
import EventGuests, {
  EventGuest,
} from "./eventGuests";
import EventGalleryForm from "./eventGalleryForm";
import EventsList from "./eventList";
import EventGallery, {
  EventGalleryItem,
} from "./eventGallery";

type Tab =
  | "events"
  | "add-event"
  | "gallery"
  | "add-gallery"
  | "guests"
  | "add-guest";

function Events() {
  const [activeTab, setActiveTab] =
    useState<Tab>("events");

  // ==========================================================
  // EVENT EDIT STATE
  // ==========================================================

  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);

    

  // ==========================================================
  // GALLERY EDIT STATE
  // ==========================================================

  const [selectedGallery, setSelectedGallery] =
    useState<EventGalleryItem | null>(null);

  // ==========================================================
  // GUEST EDIT STATE
  // ==========================================================

  /*
   * null = adding a new guest
   * EventGuest = editing an existing guest
   */
  const [selectedGuest, setSelectedGuest] =
    useState<EventGuest | null>(null);

  // ==========================================================
  // TABS
  // ==========================================================

  const tabs = [
    {
      id: "events" as Tab,
      label: "Events",
    },
    {
      id: "add-event" as Tab,
      label: "Add Event",
    },
    {
      id: "gallery" as Tab,
      label: "Gallery",
    },
    {
      id: "add-gallery" as Tab,
      label: "Add Gallery",
    },
    {
      id: "guests" as Tab,
      label: "Guests",
    },
    {
      id: "add-guest" as Tab,
      label: "Add Guest",
    },
  ];

  // ==========================================================
  // EVENT HANDLERS
  // ==========================================================

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setActiveTab("add-event");
  };

  const handleEditEvent = (
    event: Event
  ) => {
    setSelectedEvent(event);
    setActiveTab("add-event");
  };

  const handleEventSuccess = () => {
    setSelectedEvent(null);
    setActiveTab("events");
  };

  const handleEventCancel = () => {
    setSelectedEvent(null);
    setActiveTab("events");
  };

  // ==========================================================
  // GALLERY HANDLERS
  // ==========================================================

  const handleAddGallery = () => {
    setSelectedGallery(null);
    setActiveTab("add-gallery");
  };

  const handleEditGallery = (
    gallery: EventGalleryItem
  ) => {
    setSelectedGallery(gallery);
    setActiveTab("add-gallery");
  };

  const handleGallerySuccess = () => {
    setSelectedGallery(null);
    setActiveTab("gallery");
  };

  const handleGalleryCancel = () => {
    setSelectedGallery(null);
    setActiveTab("gallery");
  };

  // ==========================================================
  // GUEST HANDLERS
  // ==========================================================

  // Add new guest
  const handleAddGuest = () => {
    setSelectedGuest(null);
    setActiveTab("add-guest");
  };

  // Edit existing guest
  const handleEditGuest = (
    guest: EventGuest
  ) => {
    setSelectedGuest(guest);
    setActiveTab("add-guest");
  };

  // Guest successfully created/updated
  const handleGuestSuccess = () => {
    setSelectedGuest(null);
    setActiveTab("guests");
  };

  // Cancel guest form
  const handleGuestCancel = () => {
    setSelectedGuest(null);
    setActiveTab("guests");
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full p-6">

      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-6 mt-6">

        <h1 className="text-2xl font-semibold text-[#5B403D]">
          Events Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage hospital events, event gallery images
          and guests.
        </p>

      </div>

      {/* ====================================================
          TABS
      ===================================================== */}

      <div className="mb-6 mt-6 border-b border-gray-200">

        <div className="flex gap-1 overflow-x-auto">

          {tabs.map((tab) => {

            const isActive =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {

                  // ----------------------------------------
                  // ADD EVENT
                  // ----------------------------------------

                  if (
                    tab.id === "add-event"
                  ) {
                    handleAddEvent();
                    return;
                  }

                  // ----------------------------------------
                  // ADD GALLERY
                  // ----------------------------------------

                  if (
                    tab.id === "add-gallery"
                  ) {
                    handleAddGallery();
                    return;
                  }

                  // ----------------------------------------
                  // ADD GUEST
                  // ----------------------------------------

                  if (
                    tab.id === "add-guest"
                  ) {
                    handleAddGuest();
                    return;
                  }

                  setActiveTab(tab.id);
                }}
                className={`
                  whitespace-nowrap
                  border-b-2
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "border-[#911824] bg-[rgba(254,215,210,.25)] text-[#911824]"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#911824]"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}

        </div>
      </div>

      {/* ====================================================
          EVENTS
      ===================================================== */}

      {activeTab === "events" && (
        <div className="w-full">

          <EventsList
            onEdit={handleEditEvent}
            onView={(event) => {
              console.log(
                "View event:",
                event
              );
            }}
          />

        </div>
      )}

      {/* ====================================================
          ADD / EDIT EVENT
      ===================================================== */}

      {activeTab === "add-event" && (
        <div className="w-full">

          <EventForm
            event={selectedEvent}
            onSuccess={handleEventSuccess}
            onCancel={handleEventCancel}
          />

        </div>
      )}

      {/* ====================================================
          GALLERY
      ===================================================== */}

      {activeTab === "gallery" && (
        <div className="w-full">

          <EventGallery
            onEdit={handleEditGallery}
          />

        </div>
      )}

      {/* ====================================================
          ADD / EDIT GALLERY
      ===================================================== */}

      {activeTab === "add-gallery" && (
        <div className="w-full">

          <EventGalleryForm
            gallery={selectedGallery}
            onSuccess={handleGallerySuccess}
            onCancel={handleGalleryCancel}
          />

        </div>
      )}

      {/* ====================================================
          GUESTS
      ===================================================== */}

      {activeTab === "guests" && (
        <div className="w-full">

          <EventGuests
            onEdit={handleEditGuest}
          />

        </div>
      )}

      {/* ====================================================
          ADD / EDIT GUEST
      ===================================================== */}

      {activeTab === "add-guest" && (
        <div className="w-full">

          <EventGuestForm
            guest={selectedGuest}
            onSuccess={handleGuestSuccess}
            onCancel={handleGuestCancel}
          />

        </div>
      )}

    </div>
  );
}

export default Events;

