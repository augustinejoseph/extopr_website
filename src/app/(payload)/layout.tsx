/* Payload admin layout. Generated-style entry that mounts the Payload admin UI under /admin.
 * This route group is isolated from the public (site) routes so admin styling never leaks. */
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";

import { importMap } from "./admin/importMap.js";

import type { ServerFunctionClient } from "payload";

import "./custom.scss";

import "@payloadcms/next/css";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
