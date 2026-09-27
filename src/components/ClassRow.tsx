import Link from "next/link";
import { formatTime } from "@/lib/format";

type Props = {
  id: string;
  title: string;
  instructor: string;
  room: string;
  startsAt: Date;
  durationMin: number;
  spotsLeft: number;
  action?: React.ReactNode;
};

export default function ClassRow({ id, title, instructor, room, startsAt, durationMin, spotsLeft, action }: Props) {
  return (
    <li className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-baseline gap-4">
        <span className="w-20 shrink-0 text-sm font-semibold tabular-nums">{formatTime(startsAt)}</span>
        <div>
          <Link href={`/classes/${id}`} className="font-semibold hover:text-brand">
            {title}
          </Link>
          <p className="text-sm text-stone-500">
            {instructor} · {room} · {durationMin} min
          </p>
        </div>
      </div>
      {action ?? (
        <span className={`text-sm ${spotsLeft === 0 ? "text-red-600" : "text-stone-500"}`}>
          {spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`}
        </span>
      )}
    </li>
  );
}
