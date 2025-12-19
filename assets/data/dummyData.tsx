export const generateAlphabeticalContacts = (count: number) => {
  const contacts = [];
  for (let i = 1; i <= count; i++) {
    const charCode = 65 + ((i - 1) % 26);
    const name =
      String.fromCharCode(charCode) +
      (Math.floor((i - 1) / 26) > 0 ? Math.floor((i - 1) / 26) : "");
    contacts.push({
      id: i,
      name: name,
      number: `+1-555-${String(i).padStart(4, "0")}`,
    });
  }
  return contacts;
};
