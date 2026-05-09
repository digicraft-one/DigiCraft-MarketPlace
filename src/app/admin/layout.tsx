import { ReactNode } from "react";

/**
 * Root layout sets body text to white (marketplace). Admin uses light surfaces;
 * restore readable default foreground for this subtree.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen text-neutral-950 antialiased [color-scheme:light] [&_input]:text-neutral-950 [&_textarea]:text-neutral-950 [&_textarea]:placeholder:text-slate-500 [&_input]:placeholder:text-slate-500">
            {children}
        </div>
    );
}
