"use client";

import { useState } from "react";
import {
  FaCopy,
  FaCheck,
  FaUniversity,
  FaMoneyCheckAlt,
  FaArrowRight,
} from "react-icons/fa";

type BankAccount = {
  type: string;
  bank: string;
  accountTitle: string;
  iban: string;
  accent?: "maroon" | "gray";
};

const bankAccounts: BankAccount[] = [
  {
    type: "Zakat Account",
    bank: "Meezan Bank Ltd.",
    accountTitle: "Bashir Memorial Welfare Hospital",
    iban: "PK00MEZN0000000000000000",
    accent: "maroon",
  },
  {
    type: "General / Donation Account",
    bank: "Habib Bank Ltd (HBL)",
    accountTitle: "Bashir Memorial Welfare Hospital",
    iban: "PK00HABB0000000000000000",
    accent: "gray",
  },
];

function BankCard({ account }: { account: BankAccount }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.iban);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy IBAN:", error);
    }
  };

  return (
    <article className="relative overflow-hidden rounded-lg bg-[#242425] p-6 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
      {/* Decorative icon */}
      <div className="pointer-events-none absolute right-0 top-0 flex h-[85px] w-[85px] items-center justify-center opacity-10">
        <FaUniversity className="text-[53px] text-white" />
      </div>

      {/* Account Type */}
      <p
        className={`text-xs font-medium uppercase tracking-[1.2px] ${
          account.accent === "maroon"
            ? "text-[#86000D]"
            : "text-[#5F5E5E]"
        }`}
      >
        {account.type}
      </p>

      {/* Bank Name */}
      <h3 className="mt-2 text-2xl font-semibold leading-8 text-white">
        {account.bank}
      </h3>

      {/* Account Details */}
      <div className="mt-6 space-y-4">
        {/* Account Title */}
        <div>
          <p className="text-xs font-medium tracking-[0.24px] text-[#E4BEBA]">
            ACCOUNT TITLE
          </p>

          <p className="mt-1 font-mono text-base leading-6 text-white">
            {account.accountTitle}
          </p>
        </div>

        {/* IBAN */}
        <div>
          <p className="text-xs font-medium tracking-[0.24px] text-[#E4BEBA]">
            IBAN
          </p>

          <div className="mt-1 flex items-center justify-between gap-4">
            <p className="break-all font-mono text-base leading-6 text-white">
              {account.iban}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy IBAN"
              className="shrink-0 text-[#E4BEBA] transition-colors hover:text-white"
            >
              {copied ? (
                <FaCheck size={14} />
              ) : (
                <FaCopy size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DonationPart() {
  return (
    <section className="relative isolate overflow-hidden bg-[#303031] px-0 py-20 lg:py-[120px]">
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        aria-hidden="true"
      >
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,white_0%,transparent_25%),radial-gradient(circle_at_80%_80%,white_0%,transparent_25%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 sm:px-8 lg:flex-row lg:gap-20 lg:px-10">
        {/* LEFT INFO */}
        <div className="flex w-full flex-col lg:w-[373px] lg:shrink-0 lg:justify-between">
          <div>
            {/* Heading */}
            <div className="pb-4">
              <h2 className="text-[40px] font-bold leading-[48px] tracking-[-0.8px] text-white sm:text-[44px] sm:leading-[52px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.96px]">
                Transfer Details
              </h2>
            </div>

            {/* Description */}
            <p className="max-w-[373px] pb-8 text-lg font-normal leading-7 text-[#E4BEBA]">
              For secure, direct contributions, please use our official
              banking channels. All donations are tax-exempt under section
              2(36) of the ITO 2001.
            </p>
          </div>

          {/* Important Notice */}
          <div className="mt-8 flex min-h-[104px] items-start gap-3 rounded bg-[#86000D]/20 p-4 lg:mt-0">
            <div className="shrink-0 pt-1">
              <FaUniversity
                size={20}
                className="text-white"
              />
            </div>

            <p className="text-base leading-6 text-[#E4BEBA]">
              Please ensure that the account title and IBAN are verified
              before making a transfer. For assistance with your donation,
              contact the hospital administration.
            </p>
          </div>
        </div>

        {/* RIGHT DATA */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Bank Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {bankAccounts.map((account) => (
              <BankCard
                key={account.type}
                account={account}
              />
            ))}
          </div>

          {/* Cheque Drop-off */}
          <div className="flex flex-col gap-6 rounded-lg bg-[#242425] p-6 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center sm:justify-between">
            {/* Left */}
            <div className="flex items-start gap-4">
              {/* Icon Container */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#EFeded]/10">
                <FaMoneyCheckAlt
                  size={27}
                  className="text-white"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-semibold leading-8 text-white">
                  Cheque Drop-off
                </h3>

                <p className="mt-1 max-w-[420px] text-base leading-6 text-[#E4BEBA]">
                  Prefer to donate by cheque? You can drop your cheque at
                  the hospital administration office during working hours.
                </p>
              </div>
            </div>

            {/* Button */}
            <a
              href="/contact"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[2px] px-6 text-sm font-semibold tracking-[0.14px] text-white transition-colors duration-200 hover:bg-white/5"
            >
              Contact for Details
              <FaArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}