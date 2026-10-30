import test from "node:test";
import assert from "node:assert/strict";
import { rooms, hotel } from "../src/lib/hotel.ts";

// Independent snapshot of the official site's room-name / booking-ID pairs.
const officialRooms = new Map([
  ["Standard King Size Room", "5066922"],
  ["Standard Twin Room", "5066923"],
  ["Standard King Size Room with Balcony", "5066931"],
  ["Standard Twin Room with Balcony", "5066934"],
  ["Deluxe King Size Room with Balcony", "5066941"],
  ["Deluxe Twin Room", "5066940"],
  ["Junior Twin Suite with Balcony", "5066946"],
  ["Senior King Size Suite with Balcony", "5066947"],
]);

test("every room retains its official, room-specific booking destination", () => {
  assert.equal(rooms.length, officialRooms.size);
  assert.equal(new Set(rooms.map((room) => room.bookingUrl)).size, 8);
  for (const room of rooms) {
    assert.equal(
      room.bookingUrl,
      `${hotel.booking}?room-type=${officialRooms.get(room.name)}`,
    );
    const url = new URL(room.bookingUrl);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "jizzaxhotel.uz");
    assert.equal([...url.searchParams].length, 1);
  }
});

test("room filters account for all eight verified room categories", () => {
  assert.equal(rooms.filter((room) => room.category === "Standard").length, 4);
  assert.equal(rooms.filter((room) => room.category === "Deluxe").length, 2);
  assert.equal(rooms.filter((room) => room.category === "Suites").length, 2);
});
