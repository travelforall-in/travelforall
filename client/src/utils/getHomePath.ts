// utils/getHomePath.js
// export const getHomePath = () => {
//     const user = localStorage.getItem('user');
//     if (user) {
//       const parsed = JSON.parse(user);
//       return `/user/${parsed._id}`;
//     }
//     return '/';
//   };
  
// src/utils/getHomePath.ts

export const getHomePath = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.id) {  // Changed from _id to id
        return `/user/${parsedUser.id}`;
      }
    } catch (err) {
      console.error("Error parsing user:", err);
    }
  return '/';
};
}