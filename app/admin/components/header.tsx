import { FiExternalLink, FiBell } from "react-icons/fi";

export default function AdminHeader() {
    return (
        <header className="h-15 border-b border-[#E0BFBD]/30 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="flex h-full items-center justify-between px-6">

                {/* Page Title */}
                <div>
                    <h1 className="text-[15px] font-semibold leading-5 text-[#0B1C30]">
                        Hospital Administration
                    </h1>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">

                    {/* View Website */}
                    <a
                        href="/"
                        target="_blank"
                        className="flex h-7.5 items-center gap-1.5 rounded-xs border border-[#E0BFBD]/40 px-3 text-[12px] font-medium text-[#0B1C30] transition hover:bg-gray-50"
                    >
                        <FiExternalLink size={14} />
                        <span>View Website</span>
                    </a>

                    {/* Notification */}
                    <button
                        type="button"
                        className="flex h-6.5 items-center gap-1.5 rounded-xs border border-[#BA1A1A]/20 bg-[rgba(255,218,214,0.6)] px-2.5 text-[#BA1A1A]"
                    >
                        <FiBell size={13.5} />

                        <span className="font-mono text-[12px] font-bold">
                            3
                        </span>
                    </button>

                </div>
            </div>
        </header>
    );
}