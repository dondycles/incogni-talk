"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";
export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Switch
      defaultChecked={theme === "dark"}
      onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
}
