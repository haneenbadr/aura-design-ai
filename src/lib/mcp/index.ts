import { defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";

export default defineMcp({
  name: "dari-mcp",
  title: "Dari Interior Design MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Dari AI-powered interior design platform. Use `echo` to verify connectivity.",
  tools: [echoTool],
});
