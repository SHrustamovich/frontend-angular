import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime', standalone: true })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined): string {
    if (!value) return '-';
    const now = new Date().getTime();
    const t = new Date(value).getTime();
    if (isNaN(t)) return '-';

    const diff = Math.max(0, now - t);
    const sec = Math.floor(diff / 1000);
    if (sec < 5) return 'just now';
    if (sec < 60) return `${sec}s ago`;

    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;

    const day = Math.floor(hr / 24);
    if (day < 30) return `${day}d ago`;

    const mon = Math.floor(day / 30);
    if (mon < 12) return `${mon}mo ago`;

    const yr = Math.floor(mon / 12);
    return `${yr}y ago`;
  }
}
