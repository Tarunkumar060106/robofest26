# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Tasks

*   **Start Development Server**: `npm run dev`
*   **Build for Production**: `npm run build`
*   **Start Production Server**: `npm run start`
*   **Run Linter**: `npm run lint`

## High-Level Code Architecture

This project is a Next.js application using the App Router, primarily built with TypeScript and React. It follows a component-based architecture, with most UI elements and sections residing in the `components/` directory.

**Key Technologies & Patterns:**

*   **Next.js**: The main framework for server-side rendering, routing, and API routes (though API routes are not explicit in `app/page.tsx`).
*   **React & TypeScript**: Frontend development is done using React with TypeScript for type safety.
*   **Styling**: Utilizes Tailwind CSS for utility-first styling, along with PostCSS.
*   **Animations**: Extensive use of `gsap` (GreenSock Animation Platform) and `ScrollTrigger` for complex, scroll-based animations. `Lenis` is integrated for smooth scrolling experiences. `Framer Motion` is also available and might be used in other components.
*   **Component Structure**: The `app/page.tsx` file serves as the main entry point, orchestrating various sections and components like `Navbar`, `EventsSection`, `SponsorsSection`, `FAQSection`, `PatronsSection`, and `ContactSection`.
*   **Preloading**: A custom preloader mechanism handles asset loading and visual feedback during initial page load.
*   **Custom Scrollbar**: Features a custom scrollbar implementation with draggable functionality.
*   **Inter-component Communication**: Custom browser events (e.g., `"navbar-menu-state"`) are used for communication between certain components, particularly for UI state synchronization (like menu open/close).
