import { ReactNode } from "react";

/**
 * Root layout sets body text to white (marketplace). Admin uses light surfaces;
 * restore readable default foreground for this subtree.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen text-slate-900 antialiased [color-scheme:light] [&_textarea]:text-slate-900 [&_textarea]:placeholder:text-slate-500">
            {children}
        </div>
    );
}
