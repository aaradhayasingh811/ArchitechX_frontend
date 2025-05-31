export default function generateRooms(data) {
  const plotWidth = parseInt(data.width, 10);
  const plotLength = parseInt(data.length, 10);
  const masterCount = parseInt(data.masterRooms, 10);
  const guestCount = parseInt(data.numberOfGuestroom, 10);
  const kitchenCount = parseInt(data.numberOfKitchen, 10);
  const carCount = parseInt(data.estimatedFourWheeler, 10);
  const bikeCount = parseInt(data.estimatedTwoWheeler, 10);

  const rooms = [];

  // Master rooms with attached washrooms or toilets if required
  for (let i = 0; i < masterCount; i++) {
    const x = 5 + (i % 2) * 26;
    const y = 5 + Math.floor(i / 2) * 22;

    rooms.push({
      id: `master${i}`,
      type: "master",
      label: `Master ${i + 1}`,
      x,
      y,
      width: 20,
      height: 15,
    });

    if (data.roomsWithAttachedWashroom) {
      rooms.push({
        id: `masterWashroom${i}`,
        type: "bathroom",
        label: "Washroom",
        x: x + 20,
        y,
        width: 5,
        height: 6,
      });
    } else if (data.roomsWithAttachedToilet) {
      rooms.push({
        id: `masterToilet${i}`,
        type: "toilet",
        label: "Toilet",
        x: x + 20,
        y,
        width: 5,
        height: 6,
      });
    }
  }

  // Guest rooms
  for (let i = 0; i < guestCount; i++) {
    const x = 5 + (i % 2) * 26;
    const y = 40 + Math.floor(i / 2) * 22;
    rooms.push({
      id: `guest${i}`,
      type: "guest",
      label: `Guest ${i + 1}`,
      x,
      y,
      width: 18,
      height: 12,
    });
    // add toilets/washrooms if needed similarly
  }

  // Kitchens
  for (let i = 0; i < kitchenCount; i++) {
    const x = 5 + i * 18;
    const y = 70;
    rooms.push({
      id: `kitchen${i}`,
      type: "kitchen",
      label: "Kitchen",
      x,
      y,
      width: 12,
      height: 10,
    });
  }

  // Unattached washrooms and toilets (place around garden area or wherever suitable)
  for (let i = 0; i < parseInt(data.unattachedWashroom, 10); i++) {
    rooms.push({
      id: `washroomUnattached${i}`,
      type: "bathroom",
      label: "Washroom",
      x: plotWidth - 30,
      y: 10 + i * 10,
      width: 6,
      height: 5,
    });
  }
  for (let i = 0; i < parseInt(data.unattachedToilet, 10); i++) {
    rooms.push({
      id: `toiletUnattached${i}`,
      type: "toilet",
      label: "Toilet",
      x: plotWidth - 15,
      y: 10 + i * 10,
      width: 5,
      height: 4,
    });
  }

  // Parking spots
  const parkingStartY = plotLength - 30;
  for (let i = 0; i < carCount; i++) {
    rooms.push({
      id: `car${i}`,
      type: "car",
      label: "Car",
      x: 5 + i * 14,
      y: parkingStartY,
      width: 12,
      height: 18,
    });
  }
  for (let i = 0; i < bikeCount; i++) {
    rooms.push({
      id: `bike${i}`,
      type: "bike",
      label: "Bike",
      x: 5 + i * 7,
      y: parkingStartY - 20,
      width: 5,
      height: 10,
    });
  }

  // Main gate in center bottom
  rooms.push({
    id: "gate",
    type: "gate",
    label: "Main Gate",
    x: (plotWidth - 20) / 2,
    y: plotLength - 5,
    width: 20,
    height: 5,
  });

  // Large corridor covering whole home width
  rooms.push({
    id: "corridorH",
    type: "corridor",
    label: "Corridor",
    x: 5,
    y: 32,
    width: plotWidth - 10,
    height: 6,
  });

  return rooms;
}
