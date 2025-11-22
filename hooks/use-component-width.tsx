import { useEffect, useRef, useState } from "react";

export function useComponentWidth() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            setWidth(entry.contentRect.width);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return { ref, width };
}