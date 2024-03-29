/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { offlineFallback, staticResourceCache } from "workbox-recipes";
import { setDefaultHandler } from "workbox-routing";
import { NetworkOnly } from "workbox-strategies";

// Asset hashes to see if content has changed.
const assetHashes = self.__WB_MANIFEST;
console.log(assetHashes);

// Sets a default Network Only handler, but consider writing your own handlers, too!
staticResourceCache();
setDefaultHandler(new NetworkOnly());

// HTML to serve when the site is offline
offlineFallback({
  pageFallback: "/index.html",
});
