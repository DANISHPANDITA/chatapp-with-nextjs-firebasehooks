/** @format */

export const getRecipient = (users, userEmail) => {
  const reciepient = users?.filter((a) => a !== userEmail);
  if (reciepient) {
    return reciepient[0];
  }
};
