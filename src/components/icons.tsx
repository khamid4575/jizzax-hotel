import Image from "next/image";

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function Mark() {
  return (
    <Image
      className="brand-mark"
      src="/img/38f655103e3d41ca.webp"
      alt=""
      width={59}
      height={60}
    />
  );
}
