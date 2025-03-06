export function formatDate(input: string | number): string {
  let date: Date;

  if (typeof input === "string") {
    date = new Date(input);
  } else if (typeof input === "number") {
    // Assuming the number is in seconds (UNIX timestamp)
    date = new Date(input * 1000);
  } else {
    throw new Error("Invalid input type for formatDate");
  }

  return date.toLocaleString(); // Adjust the format as needed
}
