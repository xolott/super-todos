function _generateId(length, charset) {
  let result = "";
  const charactersLength = charset.length;
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export default function generateId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return _generateId(length, characters);
}
