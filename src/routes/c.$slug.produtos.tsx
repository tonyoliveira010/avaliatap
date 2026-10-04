import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/c/$slug/produtos")({ component: () => <Outlet /> });
