
// import { app } from "./app";

// if (app && app._router && app._router.stack) {
//   app._router.stack
//     .filter((r: { route: any; }) => r.route)
//     .forEach((route: any) => {
//       const methods = Object.keys(route.route.methods).join(', ').toUpperCase();
//       const path = route.route.path;
//       console.log(`${methods} ${path}`);
//     });
// } else {
//   console.error("Router stack is not defined. Ensure that the app and router are properly initialized.");
// }