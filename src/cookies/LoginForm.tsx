// import React, { useState, useEffect, FormEvent } from 'react';
// import CookieManager from './CookieManager';


// // Main Login Component
// export default function LoginForm() {
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   // Load saved credentials from cookies on component mount
//   useEffect(() => {
//     const savedUsername = CookieManager.get("username");
//     const savedPassword = CookieManager.get("password");
    
//     if (savedUsername) setUsername(savedUsername);
//     if (savedPassword) setPassword(savedPassword);
//   }, []);

//   // Handle form submission
//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     // Save credentials to cookies (7 days expiry)
//     CookieManager.set("username", username, 7);
//     CookieManager.set("password", password, 7);
    
//     // Here you would typically make an API call to your backend
//     console.log("Login submitted:", { username, password });
//     alert(`Login submitted for user: ${username}`);
    
//     // Example: Actual login request
//     // fetch('/login', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify({ username, password })
//     // });
//   };

//   // Clear saved credentials
//   const clearCredentials = () => {
//     CookieManager.delete("username");
//     CookieManager.delete("password");
//     setUsername("");
//     setPassword("");
//     alert("Credentials cleared!");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
//         <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//           Login
//         </h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
//           >
//             Login
//           </button>
//         </form>

//         <button
//           onClick={clearCredentials}
//           className="w-full mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
//         >
//           Clear Saved Credentials
//         </button>

//         <p className="mt-4 text-sm text-gray-600 text-center">
//           Credentials are saved in cookies for 7 days
//         </p>
//       </div>
//     </div>
//   );
// }