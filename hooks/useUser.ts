// Re-exports the shared UserContext so all components get the same user instance.
// This prevents stale UI in Navbar/BottomBar when navigating between pages.
export { useUserContext as useUser } from "@/contexts/UserContext";
