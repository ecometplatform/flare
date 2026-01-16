/**
 * Flare Build Configuration
 */

import { createFlareBuild } from "@ecomet/flare/config"

export default createFlareBuild({
	clientEntryFilePath: "src/entry-client.tsx",
	tailwind: { filePath: "./src/styles/tailwind.css", strict: false },
})
